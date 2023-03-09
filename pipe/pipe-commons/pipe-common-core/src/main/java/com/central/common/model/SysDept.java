package com.central.common.model;

import com.baomidou.mybatisplus.annotation.*;
import lombok.*;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.List;

/**
 * 部门表 dept
 */
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
@TableName("sys_dept")
public class SysDept extends SuperEntity implements Serializable {

    private static final long serialVersionUID = 1L;



    /**
     * 父部门ID
     */
    private Long parentId;

    /**
     * 部门名称
     */
    @NotBlank(message = "部门名称不能为空")
    @Size(max = 30, message = "部门名称长度不能超过30个字符")
    @TableField("dept_name")
    private String deptName;

    /**
     * 部门名称
     */
    @NotBlank(message = "部门编码不能为空")
    @Size(max = 30, message = "部门编码长度不能超过30个字符")
    private String deptCode;

    /**
     *负责人
     */
    @NotBlank(message = "部门负责人不能为空")
    @Size(max = 30, message = "部门负责人长度不能超过30个字符")
    private String leader;

    /**
     *部门描述
     */
    @NotBlank(message ="部门描述不能为空")
    private String deptDescribe;

    /**
     * 显示顺序
     */
    @NotBlank(message = "显示顺序不能为空")
    private String orderNum;

    /**
     * 联系电话
     */
    @Size(max = 11, message = "联系电话长度不能超过11个字符")
    private String phone;

    /**
     * 邮箱
     */
    @Email(message = "邮箱格式不正确")
    @Size(max = 50, message = "邮箱长度不能超过50个字符")
    private String email;

    /**
     * 部门状态:0正常,1停用
     */
    private Integer status;


    @TableField(exist = false)
    private List<SysDept> subDept;

    @TableField(exist = false)
    private List<SysUser> userInfo;
}

