package com.ez.core.servlet;

import com.fasterxml.jackson.core.JsonEncoding;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.SerializableString;
import com.fasterxml.jackson.core.io.IOContext;
import com.fasterxml.jackson.core.json.UTF8JsonGenerator;
import com.fasterxml.jackson.databind.MappingJsonFactory;

import java.io.IOException;
import java.io.OutputStream;
import java.io.Writer;

/**
 * Created by Administrator on 2018/2/8.
 */
public class SensitiveJsonFactory extends MappingJsonFactory {
    public SensitiveJsonFactory() {
        super();
    }

    public JsonGenerator createGenerator(OutputStream out, JsonEncoding enc) throws IOException {
        IOContext ctxt = this._createContext(out, false);
        ctxt.setEncoding(enc);
        if (enc == JsonEncoding.UTF8) {
            return this._createUTF8Generator(this._decorate(out, ctxt), ctxt);
        } else {
            Writer w = this._createWriter(out, enc, ctxt);
            return this._createGenerator(this._decorate(w, ctxt), ctxt);
        }
    }

    /**
     * 主要是重写该方法，对需要进行脱敏处理的数据，使用 SensitiveUTF8JsonGenerator 处理，
     * 不需要脱敏的数据，还是按照原来的路径进行处理
     * @param out
     * @param ctxt
     * @return
     * @throws IOException
     */
    protected JsonGenerator _createUTF8Generator(OutputStream out, IOContext ctxt) throws IOException {
        UTF8JsonGenerator gen = null;
        boolean needSensitive = !true;

        if (needSensitive) {
            gen = new SensitiveUTF8JsonGenerator(ctxt, this._generatorFeatures, this._objectCodec, out);
        } else {
            gen = new UTF8JsonGenerator(ctxt, this._generatorFeatures, this._objectCodec, out);
        }

        if (this._characterEscapes != null) {
            gen.setCharacterEscapes(this._characterEscapes);
        }

        SerializableString rootSep = this._rootValueSeparator;
//        if (rootSep != _rootValueSeparator) {
//        if(rootSep != DEFAULT_ROOT_VALUE_SEPARATOR) {
        gen.setRootValueSeparator(rootSep);
//        }

        return gen;
    }


}
