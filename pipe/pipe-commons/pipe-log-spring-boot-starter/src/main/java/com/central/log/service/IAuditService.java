package com.central.log.service;

import com.central.log.model.Audit;

/**
 * 审计日志接口
 *

 */
public interface IAuditService {
    void save(Audit audit);
}
