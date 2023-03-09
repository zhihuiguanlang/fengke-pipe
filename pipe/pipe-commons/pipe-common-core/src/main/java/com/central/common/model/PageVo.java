package com.central.common.model;


import lombok.Data;


import javax.validation.constraints.NotNull;
import java.io.Serializable;

@Data
public class PageVo implements Serializable{

    private static final long serialVersionUID = 1L;

    @NotNull(message = "page参数不能为空")
    private int page;
    @NotNull(message = "limit参数不能为空")
    private int limit;

    private String sort;

    private String order;
}

