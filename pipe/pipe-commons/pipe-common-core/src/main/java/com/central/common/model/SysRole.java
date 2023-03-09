package com.central.common.model;

import cn.afterturn.easypoi.excel.annotation.Excel;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 角色
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("sys_role")
public class SysRole extends SuperEntity {
    private static final long serialVersionUID = 4497149010220586111L;
    @Excel(name = "编号", height = 20, width = 30, isImportField = "true_st")
    private String code;
    @Excel(name = "名称", height = 20, width = 30, isImportField = "true_st")
    private String name;
    @Excel(name = "用户id", height = 20, width = 30, isImportField = "true_st")
    private Long userId;
}
