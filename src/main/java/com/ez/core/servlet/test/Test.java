package com.ez.core.servlet.test;

import com.ez.core.servlet.SensitiveObjectMapper;
import com.fasterxml.jackson.core.JsonEncoding;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.mvel2.MVEL;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2018/2/8.
 */
public class Test {
    public static void main(String[] args) {

        testMapper();
    }

    public static void testMapper1() {

        Map<String, Object> lv1 = new HashMap<String, Object>();

        lv1.put("a", 1);
        lv1.put("b", 1);


        Map<String, Object> lv2m = new HashMap<String, Object>();

        lv2m.put("c", 1);

        lv1.put("map2", lv2m);


        List<Map<String, Object>> lv2l = new ArrayList<Map<String, Object>>();
        lv1.put("list2", lv2l);


        Map<String, Object> lv2l_3m = new HashMap<String, Object>();
        Map<String, Object> lv2l_3m1 = new HashMap<String, Object>();
        Map<String, Object> lv2l_3m2 = new HashMap<String, Object>();
        Map<String, Object> lv2l_3m3 = new HashMap<String, Object>();

        lv2l_3m.put("a", 1);
        lv2l_3m1.put("a", 1);
        lv2l_3m2.put("a", 1);
        lv2l_3m3.put("a", 1);
        lv2l.add(lv2l_3m);
        lv2l.add(lv2l_3m1);
        lv2l.add(lv2l_3m2);
        lv2l.add(lv2l_3m3);

        Object result = MVEL.eval("list2", lv1);

        System.out.println(result);
        System.out.println(lv1);

        SensitiveObjectMapper mapper = new SensitiveObjectMapper();


    }

    public static void testMapper() {

        try {
//            ObjectMapper objectMapper = new ObjectMapper();
            ObjectMapper objectMapper = new SensitiveObjectMapper();
            JsonGenerator jsonGenerator = objectMapper.getJsonFactory()
                    .createJsonGenerator(System.out, JsonEncoding.UTF8);

            //对象转JSON
            User user = new User("张三", 23, "深圳市");
            System.out.println("ObjectMapper方式1");
            objectMapper.writeValue(System.out, user);//直接输出到控制台
            String userJsonStr = objectMapper.writeValueAsString(user);//返回字符串，输出
            System.out.println(userJsonStr);
            System.out.println("JsonGenerator方式2");
            jsonGenerator.writeObject(user);
            System.out.println();

            //map转JSON
            Map<String, Object> map = new HashMap<String, Object>();
            map.put("one", new User("张", 12, "深圳"));
            map.put("two", new User("李", 22, "武汉"));
            map.put("three", new User("王", 32, "北京"));
            System.out.println("ObjectMapper方式3");
            objectMapper.writeValue(System.out, map);
            //JsonGenerator方式同上



            //list转JSON
            List<User> list = new ArrayList<User>();
            list.add(new User("张", 12, "深圳"));
            list.add(new User("李", 22, "武汉"));
            list.add(new User("王", 32, "北京"));
            System.out.println("ObjectMapper方式");
            objectMapper.writeValue(System.out, list);
            //JsonGenerator方式同上

            //JSON转java对象：
            String json = "{\"name\":\"张三\",\"age\":23,\"address\":\"深圳市\"}";
            User zhang = objectMapper.readValue(json, User.class);
            System.out.println(zhang.getName() + "\n" + zhang.getAge() + "\n" + zhang.getAddress());

            //JSON转list
            String listJson = "[{\"name\":\"张三\",\"age\":21,\"address\":\"深圳\"},"
                    + "{\"name\":\"李四\",\"age\":11,\"address\":\"武汉\"},"
                    + "{\"name\":\"王五\",\"age\":31,\"address\":\"北京\"}]";
            JavaType javaType1 = objectMapper.getTypeFactory().constructParametricType(ArrayList.class, User.class);
            List<User> userList = (List<User>) objectMapper.readValue(listJson, javaType1);
            for (User user1 : userList) {
                System.out.println(user1.getName() + "\t" + user1.getAge() + "\t" + user1.getAddress());
            }

            //JSON转map
            String mapJson = "{\"one\":{\"name\":\"张三\",\"age\":21,\"address\":\"深圳\"},"
                    + "\"two\":{\"name\":\"李四\",\"age\":11,\"address\":\"武汉\"},"
                    + "\"three\":{\"name\":\"王五\",\"age\":31,\"address\":\"北京\"}}";
            JavaType javaType2 = objectMapper.getTypeFactory().constructParametricType(HashMap.class, String.class, User.class);
            Map<String, User> userMap = (Map<String, User>) objectMapper.readValue(mapJson, javaType2);
            User one = userMap.get("one");
            User two = userMap.get("two");
            User three = userMap.get("three");
            System.out.println(one.getName() + "\t" + one.getAge() + "\t" + one.getAddress());
            System.out.println(two.getName() + "\t" + two.getAge() + "\t" + two.getAddress());
            System.out.println(three.getName() + "\t" + three.getAge() + "\t" + three.getAddress());

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
