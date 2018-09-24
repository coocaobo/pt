package com.ez.core.server.upload;

import com.ez.core.service.EzService;
import org.apache.poi.hssf.usermodel.*;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.ss.util.RegionUtil;

import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.*;

public class DataExportServer implements EzService {
    public void exportExcel(Map<String, Object> reqData, Map<String, Object> resData)
            throws IOException {
        Map bookInfo = new HashMap();
        bookInfo = (Map) reqData.get("bookInfo");
        List headerInfo = new ArrayList();
        headerInfo = (List) reqData.get("headerInfo");
        List bodyInfo = new ArrayList();
        bodyInfo = (List) reqData.get("bodyInfo");
        HSSFWorkbook wb = getHSSFWorkbook(bookInfo, headerInfo, bodyInfo);

        String fileName = bookInfo.get("fileName") == null ? null : bookInfo.get("fileName").toString();
        if (fileName == null) {
            fileName = System.currentTimeMillis() + "";
        }
        String path = getClass().getClassLoader().getResource("").getPath();
        int index = path.lastIndexOf("/WEB-INF/classes");
        path = path.substring(1, index) + "/tmp/";
        File file = new File(path);
        if (!file.exists()) {
            file.mkdirs();
        }
        fileName = UUID.randomUUID() + ".xls";
        path = path + fileName;
        file = new File(path);
        file.createNewFile();
        System.out.println("path: " + path);
        FileOutputStream os = new FileOutputStream(file);
        wb.write(os);
        os.flush();
        os.close();
        resData.put("fileName", fileName);
    }

    private HSSFWorkbook getHSSFWorkbook(Map<String, Object> bookInfo, List<Map<String, Object>> headerInfo, List<Map<String, Object>> bodyInfo) {
        HSSFWorkbook wb = new HSSFWorkbook();

        String sheetName = bookInfo.get("sheetName") == null ? null : bookInfo.get("sheetName").toString();
        if (sheetName == null) {
            sheetName = "first";
        }
        HSSFSheet sheet = wb.createSheet(sheetName);

        String colWidth = bookInfo.get("colWidth") == null ? null : bookInfo.get("colWidth").toString();
        if (colWidth != null) {
            int width = Integer.parseInt(colWidth);
            sheet.setDefaultColumnWidth(width);
        }

        String rowHeight = bookInfo.get("rowHeight") == null ? null : bookInfo.get("rowHeight").toString();
        if (rowHeight != null) {
            short height = Short.parseShort(rowHeight);
            sheet.setDefaultRowHeight(height);
        }

        int rowIndex = 0;
        HSSFRow row = null;
        HSSFCell cell = null;

        HSSFCellStyle defaultStyle = getCellStyle("s", wb);

        String sheetTitle = bookInfo.get("sheetTitle") == null ? null : bookInfo.get("sheetTitle").toString();
        if (sheetTitle == null) {
            sheetTitle = "";
        }
        int currentRow = rowIndex++;
        row = sheet.createRow(currentRow);
        cell = row.createCell(0);
        cell.setCellValue(sheetTitle);
        cell.setCellStyle(defaultStyle);

        int headerColNum = headerInfo.size();

        CellRangeAddress cra = new CellRangeAddress(currentRow, currentRow, 0, headerColNum - 1);
        sheet.addMergedRegion(cra);
        RegionUtil.setBorderTop(BorderStyle.MEDIUM, cra, sheet);
        RegionUtil.setBorderRight(BorderStyle.MEDIUM, cra, sheet);
        RegionUtil.setBorderBottom(BorderStyle.MEDIUM, cra, sheet);
        RegionUtil.setBorderLeft(BorderStyle.MEDIUM, cra, sheet);
        RegionUtil.setTopBorderColor(IndexedColors.BLACK.getIndex(), cra, sheet);
        RegionUtil.setRightBorderColor(IndexedColors.BLACK.getIndex(), cra, sheet);
        RegionUtil.setBottomBorderColor(IndexedColors.BLACK.getIndex(), cra, sheet);
        RegionUtil.setLeftBorderColor(IndexedColors.BLACK.getIndex(), cra, sheet);

        currentRow = rowIndex++;
        row = sheet.createRow(currentRow);
        for (int i = 0; i < headerColNum; i++) {
            cell = row.createCell(i);
            Map hearderCol = (Map) headerInfo.get(i);
            String colName = hearderCol.get("colName") == null ? null : hearderCol.get("colName").toString();
            if (colName == null) {
                colName = "";
            }
            cell.setCellValue(colName);
            cell.setCellStyle(getCellStyle("s", wb));
        }

        for (int i = 0; i < bodyInfo.size(); i++) {
            currentRow = rowIndex++;
            row = sheet.createRow(currentRow);
            Map rowData = (Map) bodyInfo.get(i);
            for (int j = 0; j < headerColNum; j++) {
                cell = row.createCell(j);
                Map hearderCol = (Map) headerInfo.get(j);
                String colIndex = hearderCol.get("colIndex") == null ? null : hearderCol.get("colIndex").toString();
                if (colIndex == null) {
                    colIndex = "";
                }

                String colType = hearderCol.get("colType") == null ? null : hearderCol.get("colType").toString();
                if (colType == null) {
                    colType = "s";
                }
                String cellData = rowData.get(colIndex) == null ? null : rowData.get(colIndex).toString();
                if (cellData == null) {
                    colType = "";
                }
                cell.setCellValue(cellData);
                HSSFCellStyle cellStyle = getCellStyle(colType, wb);
                cell.setCellStyle(cellStyle);
            }
        }
        return wb;
    }

    public void setResponseHeader(HttpServletResponse response, String fileName) {
        try {
            try {
                fileName = fileName + ".xls";
                fileName = new String(fileName.getBytes(), "ISO8859-1");
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
            response.setContentType("application/octet-stream;charset=ISO8859-1");
            response.setHeader("Content-Disposition", "attachment;filename=" + fileName);
            response.addHeader("Pargam", "no-cache");
            response.addHeader("Cache-Control", "no-cache");
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    private HSSFCellStyle getCellStyle(String type, HSSFWorkbook wb) {
        HSSFCellStyle cellStyle = wb.createCellStyle();
        HSSFFont fontStyle = wb.createFont();

        switch (type) {
            case "d":
                fontStyle.setColor(HSSFColor.HSSFColorPredefined.BLUE.getIndex());
                break;
            case "t":
                fontStyle.setColor(HSSFColor.HSSFColorPredefined.BLACK.getIndex());
                break;
            default:
                fontStyle.setColor(HSSFColor.HSSFColorPredefined.BLACK.getIndex());
        }

        cellStyle.setFont(fontStyle);
        cellStyle.setBorderTop(BorderStyle.MEDIUM);
        cellStyle.setBorderRight(BorderStyle.MEDIUM);
        cellStyle.setBorderBottom(BorderStyle.MEDIUM);
        cellStyle.setBorderLeft(BorderStyle.MEDIUM);
        cellStyle.setTopBorderColor(IndexedColors.BLACK.getIndex());
        cellStyle.setRightBorderColor(IndexedColors.BLACK.getIndex());
        cellStyle.setBottomBorderColor(IndexedColors.BLACK.getIndex());
        cellStyle.setLeftBorderColor(IndexedColors.BLACK.getIndex());
        return cellStyle;
    }
}