package com.ez.core.service.dic;

import com.ez.core.service.EzService;
import com.ez.core.service.resource.dictionary.DicService;
import com.ez.core.service.resource.dictionary.Dictionary;
import com.ez.util.EzStrUtil;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2018/1/11.
 */
public class DictionaryService  implements EzService {

    private final String dicIdProp = "dicId";
    private final String parentIdProp = "parentId";
    private final String sliceProp = "slice";

    private final String sliceChildren = "1";
    private final String allItems = "2";
    public void loadItem(Map<String, Object> req, Map<String, Object> res) {

        String dicId = (String)req.get(dicIdProp);
        String parentId = (String)req.get(parentIdProp);
        String slice = (String)req.get(sliceProp);

        if(slice == null) {
            slice = sliceChildren;
        }
        if(EzStrUtil.isEmpty(dicId)) {
            return;
        }

        Dictionary dictionary = DicService.instance().get(dicId);
        if(dictionary == null) {
            return;
        }

        if(EzStrUtil.isEmpty(parentId)) {
            parentId = Dictionary.rootId;
        }

        List list = null;
        if(slice.equals(sliceChildren)) {
            list = dictionary.getChildren(parentId, null);
        }else if(slice.equals(allItems)) {
            list = dictionary.getAllItem();
        }

        res.put("items", list);

    }
}
