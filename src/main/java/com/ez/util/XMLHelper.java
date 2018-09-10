package com.ez.util;

import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.io.OutputFormat;
import org.dom4j.io.SAXReader;
import org.dom4j.io.XMLWriter;

import java.io.*;

public class XMLHelper {
    private static final String DEFAULT_ENCODING = "UTF-8";

    public static Document createDocument() {
        return DocumentHelper.createDocument();
    }

    public static Document getDocument(String fileName) throws DocumentException, IOException {
        return getDocument(new File(fileName));
    }

    public static Document getDocument(File file) throws DocumentException, IOException {
        return getDocument(new FileInputStream(file));
    }

    public static Document getDocument(InputStream ins) throws DocumentException, IOException {
        SAXReader oReader = new SAXReader();
        try {
            return oReader.read(ins);
        } finally {
            ins.close();
        }
    }

    public static void putDocument(OutputStream outs, Document doc) throws IOException {
        OutputFormat format = OutputFormat.createPrettyPrint();
        XMLWriter writer = null;
        try {
            format.setEncoding(DEFAULT_ENCODING);
            writer = new XMLWriter(outs, format);
            writer.setEscapeText(false);
            writer.write(doc);
        } finally {
            if (writer != null) {
                writer.close();
            }
        }
    }

    public static void putDocument(File file, Document doc) throws IOException {
        OutputFormat format = OutputFormat.createPrettyPrint();
        XMLWriter writer = null;
        try {
            format.setEncoding(DEFAULT_ENCODING);
            writer = new XMLWriter(new FileOutputStream(file), format);
            writer.setEscapeText(true);
            writer.write(doc);
        } finally {
            if (writer != null) {
                writer.close();
            }
        }
    }

}
