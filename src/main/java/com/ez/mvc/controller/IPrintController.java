package com.ez.mvc.controller;

import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.data.JRMapCollectionDataSource;
import net.sf.jasperreports.engine.export.JRPdfExporter;
import net.sf.jasperreports.engine.util.JRLoader;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.io.*;
import java.util.*;

/**
 * Created by Administrator on 2018/10/9.
 */
@Controller
public class IPrintController {

    @RequestMapping(value = "iprint", method = RequestMethod.GET)
    public void printIReport() {
//        type1 load jrxml
//        type2 export to response;


    }

    /**
     * List<JasperPrint>
     */
    private void loadReportFile() {

    }

    public static void main(String[] args) {
        JasperPrint print = null;
        try {

            InputStream is = new FileInputStream("C:/Users/Administrator/Desktop/report1.jasper");
            Map map = new HashMap();

            List<Map<String, Object>> list = new ArrayList<>();

            for( int i = 0;i < 100; i ++) {
                Map<String, Object>  tmp = new HashMap<>();
                tmp.put("aCTIONICON", "1" + i);
                list.add(tmp);
            }

            JasperReport jasperReport = (JasperReport) JRLoader.loadObject(is);

            print = JasperFillManager.fillReport(jasperReport, map, new JRBeanCollectionDataSource(list));

            String fillName = new Date().getTime() + "";
            String filePath = "C:/Users/Administrator/Desktop/" + fillName + ".pdf";
            String filePath2 = "C:/Users/Administrator/Desktop/" + fillName + ".html";
            JasperExportManager.exportReportToPdfFile(print, filePath);
//            JasperExportManager.exportReportToHtmlFile(print, filePath2);

        }catch(Exception e) {
            e.printStackTrace();
        }
    }
    public static void main1(String[] args) {
        Map parameters = new HashMap();
        ByteArrayOutputStream outPut = new ByteArrayOutputStream();
        FileOutputStream outputStream = null;
        File file = new File("C:/Users/Administrator/Desktop/a.pdf");
        String reportModelFile = "C:/Users/Administrator/Desktop/report1.jasper";

        try {
            List<Map<String, Object>> records = new ArrayList<Map<String, Object>>();

            JRMapCollectionDataSource jrMapCollectionDataSource = new JRMapCollectionDataSource((Collection)records);

            JasperPrint jasperPrint = JasperFillManager.fillReport(reportModelFile, parameters, jrMapCollectionDataSource);
            JRAbstractExporter exporter = new JRPdfExporter();

            exporter.setParameter(JRExporterParameter.JASPER_PRINT, jasperPrint);
            exporter.setParameter(JRExporterParameter.OUTPUT_STREAM, outPut);

            exporter.exportReport();

            outputStream = new FileOutputStream(file);
            outputStream.write(outPut.toByteArray());

        } catch (Exception e) {
            e.printStackTrace();
        } finally {

        }
    }


    private class ReportDataSource implements JRDataSource {

        @Override
        public boolean next() throws JRException {
            return false;
        }

        @Override
        public Object getFieldValue(JRField jrField) throws JRException {
            return null;
        }
    }
}