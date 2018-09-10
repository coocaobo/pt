package com.ez.mvc.controller;

import com.ez.core.dao.BaseDao;
import com.ez.core.dao.IDao;
import com.ez.core.exception.EzCode;
import com.ez.core.response.EzResponse;
import com.ez.core.server.upload.FileAppServer;
import com.ez.mvc.controller.support.Constains;
import com.ez.util.EzStrUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.*;

/**
 * Created by Administrator on 2018/1/19.
 */
@Controller
public class UploadController {

    private static final String filepath = "appfile";
    public static final File baseFile = new FileSystemResource(filepath).getFile();
    public static final String absolutePath = baseFile.getAbsolutePath();

    @Autowired
    private FileAppServer fileAppServer;

    static {
        if (!baseFile.exists()) {
            baseFile.mkdirs();
        }
    }

    @RequestMapping(value = "upload.file", method = RequestMethod.POST)
    @ResponseBody
    public EzResponse springUpload(HttpServletRequest request) {
        CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver(request.getSession().getServletContext());

        EzResponse ezResponse = EzResponse.newRight();
        try {
            if (multipartResolver.isMultipart(request)) {
                List<String> appFileIds = new ArrayList<String>();
                String appType = request.getParameter(Constains.FIEL_APP_TYPE);
                String appKey = request.getParameter(Constains.FIEL_APP_PKEY);

                MultipartHttpServletRequest multiRequest = (MultipartHttpServletRequest) request;
                Iterator iter = multiRequest.getFileNames();
                IDao dao = BaseDao.getInstance();
                Map<String, Object> reqData = new HashMap<String, Object>();
                Map<String, Object> resData = new HashMap<String, Object>();

                reqData.put("fileSchema", "base.File");
                reqData.put("appSchema", "base.FileApp");

                while (iter.hasNext()) {
                    MultipartFile file = multiRequest.getFile(iter.next().toString());
                    String fileName = file.getOriginalFilename();
                    String fileType = fileName.substring(fileName.lastIndexOf("."));
                    String saveFielName = UUID.randomUUID().toString();
                    String saveFileName = saveFielName + fileType;
                    if (file != null) {
                        String path = absolutePath + File.separator + saveFileName;
                        file.transferTo(new File(path));


                        Map<String, Object> fileRec = new HashMap<String, Object>();
                        fileRec.put("FILENAME", fileName);
                        fileRec.put("STOREPATH", saveFileName);
                        fileRec.put("FILETYPE", fileType);
                        fileRec.put("FILESIZE", file.getSize());

                        Map<String, Object> fileAppRec = new HashMap<String, Object>();
                        fileAppRec.put("APPTYPE", appType);
                        fileAppRec.put("APPPKEY", appKey);

                        reqData.put("fileBody", fileRec);
                        reqData.put("appBody", fileAppRec);

                        fileAppServer.SaveFileAddApp(reqData, resData);

                        String appFileId = (String) resData.get("appFileId");

                        appFileIds.add(appFileId);
                    }

                }
                ezResponse.setBody(appFileIds);
            }
        } catch (Exception e) {
            e.printStackTrace();
            ezResponse.setCode(EzCode.ERROR_FILE_UPLOAD);
        }


        return ezResponse;
    }

    /**
     * 文件下载
     *
     * @return
     */
    @RequestMapping("down.file")
    public void downloadFile(HttpServletRequest request, HttpServletResponse response) {
        String fileId = request.getParameter("FILEID");
        if (EzStrUtil.isEmpty(fileId)) {
            return;
        }
        Map<String, Object> fileInfo = BaseDao.getInstance().loadSingleBySchemaAndPkey("base.File", Long.parseLong(fileId));
        if (fileInfo == null) {
            return;
        }

        String pathFileName = (String) fileInfo.get("STOREPATH");
        if (EzStrUtil.isEmpty(pathFileName)) {
            return;
        }

        String realName = (String) fileInfo.get("FILENAME");
        if (EzStrUtil.isEmpty(realName)) {
            realName = pathFileName;
        }

        String realPath = absolutePath;
        File file = new File(realPath, pathFileName);
        if (file.exists()) {
            response.setContentType("application/force-download");// 设置强制下载不打开
            response.addHeader("Content-Disposition", "attachment;fileName=" + realName);// 设置文件名
            byte[] buffer = new byte[1024];
            FileInputStream fis = null;
            BufferedInputStream bis = null;
            try {
                fis = new FileInputStream(file);
                bis = new BufferedInputStream(fis);
                OutputStream os = response.getOutputStream();
                int i = bis.read(buffer);
                while (i != -1) {
                    os.write(buffer, 0, i);
                    i = bis.read(buffer);
                }
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                if (bis != null) {
                    try {
                        bis.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
                if (fis != null) {
                    try {
                        fis.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
    }
}
