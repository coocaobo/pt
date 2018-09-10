package com.ez.core.servlet;

import com.fasterxml.jackson.core.Base64Variant;
import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.core.ObjectCodec;
import com.fasterxml.jackson.core.SerializableString;
import com.fasterxml.jackson.core.io.IOContext;
import com.fasterxml.jackson.core.json.UTF8JsonGenerator;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.Reader;
import java.math.BigDecimal;
import java.math.BigInteger;

/**
 * Created by Administrator on 2018/2/8.
 */
public class SensitiveUTF8JsonGenerator extends UTF8JsonGenerator {

    private StringBuffer basePath = new StringBuffer();

    //    private String[] path = new String[];
    public SensitiveUTF8JsonGenerator(IOContext ctxt, int features, ObjectCodec codec, OutputStream out) {
        super(ctxt, features, codec, out);
    }

    public SensitiveUTF8JsonGenerator(IOContext ctxt, int features, ObjectCodec codec, OutputStream out, byte[] outputBuffer, int outputOffset, boolean bufferRecyclable) {
        super(ctxt, features, codec, out, outputBuffer, outputOffset, bufferRecyclable);
    }


    private void addPath(SerializableString name) {
        this.basePath.append(".").append(name);
    }

    private void addPath(String name) {
        this.basePath.append(".").append(name);
    }

    private void deleteOnePath() {
        int index = basePath.lastIndexOf(".");
        if (index != -1) {
            basePath.delete(index, basePath.length());
        }

    }

    private void dealRemovePath() {
        deleteOnePath();
    }

    public void writeFieldName(SerializableString name) throws IOException {
        addPath(name);
        super.writeFieldName(name);
    }

    public void writeFieldName(String name) throws IOException {
        addPath(name);
        super.writeFieldName(name);
    }

    public void writeString(String text) throws IOException {
        text = sensitiveTransfer(text);
        super.writeString(text);
    }


    public void writeString(Reader reader, int len) throws IOException {
        super.writeString(reader, len);
        dealRemovePath();
    }

    public void writeString(char[] text, int offset, int len) throws IOException {
        super.writeString(text, offset, len);
        dealRemovePath();
    }

    public void writeRawUTF8String(byte[] text, int offset, int length) throws IOException {
        super.writeRawUTF8String(text, offset, length);
        dealRemovePath();
    }

    public void writeUTF8String(byte[] text, int offset, int len) throws IOException {
        super.writeUTF8String(text, offset, len);
        dealRemovePath();
    }

    public void writeBinary(Base64Variant a, byte[] b, int c, int d) throws IOException, JsonGenerationException {
        super.writeBinary(a, b, c, d);
        dealRemovePath();
    }

    public int writeBinary(Base64Variant a, InputStream b, int c) throws IOException, JsonGenerationException {
        int ret = super.writeBinary(a, b, c);
        dealRemovePath();
        return ret;
    }


    public void writeNumber(short s) throws IOException {
        super.writeNumber(s);
        sensitiveTransfer(s);
    }

    private void sensitiveTransfer(short s) {
        sensitiveTransfer(s);
    }


    public void writeNumber(int i) throws IOException {
        super.writeNumber(i);
        sensitiveTransfer(i);
    }

    private void sensitiveTransfer(int i) {
        dealRemovePath();
    }

    public void writeNumber(long l) throws IOException {
        super.writeNumber(l);
        sensitiveTransfer(l);
    }

    private void sensitiveTransfer(long l) {
        dealRemovePath();
    }


    public void writeNumber(BigInteger value) throws IOException {
        super.writeNumber(value);
        sensitiveTransfer(value);
    }

    private void sensitiveTransfer(BigInteger value) {
        dealRemovePath();
    }

    public void writeNumber(double d) throws IOException {
        super.writeNumber(d);
        sensitiveTransfer(d);
    }

    private void sensitiveTransfer(double d) {
        dealRemovePath();
    }


    public void writeNumber(float f) throws IOException {
        super.writeNumber(f);
        sensitiveTransfer(f);
    }

    private void sensitiveTransfer(float f) {
        dealRemovePath();
    }

    public void writeNumber(BigDecimal value) throws IOException {
        super.writeNumber(value);
        sensitiveTransfer(value);
    }

    private void sensitiveTransfer(BigDecimal value) {
        dealRemovePath();
    }

    public void writeNumber(String encodedValue) throws IOException {
        encodedValue = sensitiveTransfer(encodedValue);
        super.writeNumber(encodedValue);
    }

    private String sensitiveTransfer(String encodedValue) {
        /**
         * 判断是否需要进行脱敏
         * 根据 basePath 和脱敏规则;
         */

//        String ret = encodedValue ;
        String ret = encodedValue + "脱敏";

//        System.out.println("basePath: " + basePath);
//        try {
//            System.out.println(new String(this._outputBuffer, "UTF-8"));
//        } catch (UnsupportedEncodingException e) {
//            e.printStackTrace();
//        }
        dealRemovePath();
        return ret;
    }


    public void writeBoolean(boolean state) throws IOException {
        super.writeBoolean(state);
        sensitiveTransfer(state);
    }

    private void sensitiveTransfer(boolean state) {
        /**
         * 判断是否需要进行脱敏
         * 根据 basePath 和脱敏规则;
         */
        dealRemovePath();
    }

    public void writeNull() throws IOException {
        super.writeNull();
        dealRemovePath();
    }


}
