package com.central.common.model;

import java.util.List;
import java.util.Set;

import cn.afterturn.easypoi.excel.annotation.Excel;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("sys_menu")
public class SysMenu extends SuperEntity {
	private static final long serialVersionUID = 749360940290141180L;

	private Long parentId;
	@Excel(name = "名称", height = 20, width = 30, isImportField = "true_st")
	private String name;
	@Excel(name = "css", height = 20, width = 30, isImportField = "true_st")
	private String css;
	@Excel(name = "url", height = 20, width = 30, isImportField = "true_st")
	private String url;
	@Excel(name = "path", height = 20, width = 30, isImportField = "true_st")
	private String path;
	@Excel(name = "排序", height = 20, width = 30, isImportField = "true_st")
	private Integer sort;
	@Excel(name = "类型", height = 20, width = 30, isImportField = "true_st")
	private Integer type;
	@Excel(name = "是否隐藏", height = 20, width = 30, isImportField = "true_st")
	private Boolean hidden;
	/**
	 * 请求的类型
	 */
	private String pathMethod;

	@TableField(exist = false)
	private List<SysMenu> subMenus;
	@TableField(exist = false)
	private Long roleId;
	@TableField(exist = false)
	private Set<Long> menuIds;
}
