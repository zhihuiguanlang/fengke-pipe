package com.central.oauth2.common.store;

import com.central.oauth2.common.properties.SecurityProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.oauth2.provider.token.TokenStore;

/**
 * 认证服务器使用Redis存取令牌
 * 注意: 需要配置redis参数
 *
 *
 */
@ConditionalOnProperty(prefix = "pipe.oauth2.token.store", name = "type", havingValue = "redis", matchIfMissing = true)
public class AuthRedisTokenStore {
    @Autowired
    private RedisConnectionFactory connectionFactory;

    @Autowired
    private SecurityProperties securityProperties;
    @Autowired
    private RedisTemplate<String, Object> redisTemplate ;

    @Bean
    public TokenStore tokenStore() {
//        GoodRedisTokenStore redisTemplateStore = new GoodRedisTokenStore();
//        redisTemplateStore.setRedisTemplate(redisTemplate);
//        return redisTemplateStore;
        return new CustomRedisTokenStore(connectionFactory, securityProperties);
    }
}
