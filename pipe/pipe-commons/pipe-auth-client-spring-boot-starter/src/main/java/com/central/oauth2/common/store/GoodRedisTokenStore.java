package com.central.oauth2.common.store;

import com.alibaba.fastjson.JSONObject;
import com.central.common.constant.SecurityConstants;
import com.central.oauth2.common.properties.SecurityProperties;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.oauth2.common.DefaultOAuth2AccessToken;
import org.springframework.security.oauth2.common.ExpiringOAuth2RefreshToken;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.common.OAuth2RefreshToken;
import org.springframework.security.oauth2.provider.ClientDetails;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.OAuth2Request;
import org.springframework.security.oauth2.provider.token.AuthenticationKeyGenerator;
import org.springframework.security.oauth2.provider.token.DefaultAuthenticationKeyGenerator;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.security.oauth2.provider.token.store.redis.JdkSerializationStrategy;
import org.springframework.security.oauth2.provider.token.store.redis.RedisTokenStore;
import org.springframework.security.oauth2.provider.token.store.redis.RedisTokenStoreSerializationStrategy;
import org.springframework.util.ClassUtils;
import org.springframework.util.ReflectionUtils;

import java.lang.reflect.Method;
import java.util.*;
import java.util.concurrent.TimeUnit;

/**
 * 优化自Spring Security的RedisTokenStore
 * 1. 支持redis所有集群模式包括cluster模式
 * 2. 使用pipeline减少连接次数，提升性能
 * 3. 自动续签token（可配置是否开启）
 *
 *
 */
public class GoodRedisTokenStore implements TokenStore {
    private static final String ACCESS = "access:";
    private static final String AUTH_TO_ACCESS = "auth_to_access:";
    private static final String REFRESH_AUTH = "refresh_auth:";
    private static final String ACCESS_TO_REFRESH = "access_to_refresh:";
    private static final String REFRESH = "refresh:";
    private static final String REFRESH_TO_ACCESS = "refresh_to_access:";


    private AuthenticationKeyGenerator authenticationKeyGenerator = new DefaultAuthenticationKeyGenerator();

    private String prefix = "";
    private RedisTemplate<String, Object> redisTemplate;


    /**
     * 认证配置
     */
    private SecurityProperties securityProperties;

    public void setRedisTemplate(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void setAuthenticationKeyGenerator(AuthenticationKeyGenerator authenticationKeyGenerator) {
        this.authenticationKeyGenerator = authenticationKeyGenerator;
    }

    public void setPrefix(String prefix) {
        this.prefix = prefix;
    }

    @Override
    public OAuth2AccessToken getAccessToken(OAuth2Authentication authentication) {
        String key = authenticationKeyGenerator.extractKey(authentication);
        //System.out.println(redisTemplate.opsForValue().get(AUTH_TO_ACCESS + key).toString());
        //OAuth2AccessToken accessToken = DefaultOAuth2AccessToken.valueOf((Map<String, String>)(redisTemplate.opsForValue().get(AUTH_TO_ACCESS + key)));
        OAuth2AccessToken accessToken = (OAuth2AccessToken) redisTemplate.opsForValue().get(AUTH_TO_ACCESS + key);
        if (accessToken != null){
            String value = accessToken.getValue();
            if (!key.equals(authenticationKeyGenerator.extractKey(readAuthentication(value)))){
                storeAccessToken(accessToken, authentication);
            }

        }
        return accessToken;
    }

    @Override
    public OAuth2Authentication readAuthentication(OAuth2AccessToken token) {
        OAuth2Authentication auth2Authentication = readAuthentication(token.getValue());
        //是否开启token续签
        boolean isRenew = securityProperties.getAuth().getRenew().getEnable();
        if (isRenew && auth2Authentication != null) {
            OAuth2Request clientAuth = auth2Authentication.getOAuth2Request();
            //判断当前应用是否需要自动续签
            if (checkRenewClientId(clientAuth.getClientId())) {
                //获取过期时长
                int validitySeconds = getAccessTokenValiditySeconds(clientAuth.getClientId());
                if (validitySeconds > 0) {
                    double expiresRatio = token.getExpiresIn() / (double)validitySeconds;
                    //判断是否需要续签，当前剩余时间小于过期时长的50%则续签
                    if (expiresRatio <= securityProperties.getAuth().getRenew().getTimeRatio()) {
                        //更新AccessToken过期时间
                        DefaultOAuth2AccessToken oAuth2AccessToken = (DefaultOAuth2AccessToken) token;
                        oAuth2AccessToken.setExpiration(new Date(System.currentTimeMillis() + (validitySeconds * 1000L)));
                        storeAccessToken(oAuth2AccessToken, auth2Authentication, true);
                    }
                }
            }
        }
        return auth2Authentication;
    }

    /**
     * 判断应用自动续签是否满足白名单和黑名单的过滤逻辑
     * @param clientId 应用id
     * @return 是否满足
     */
    private boolean checkRenewClientId(String clientId) {
        boolean result = true;
        //白名单
        List<String> includeClientIds = securityProperties.getAuth().getRenew().getIncludeClientIds();
        //黑名单
        List<String> exclusiveClientIds = securityProperties.getAuth().getRenew().getExclusiveClientIds();
        if (includeClientIds.size() > 0) {
            result = includeClientIds.contains(clientId);
        } else if(exclusiveClientIds.size() > 0) {
            result = !exclusiveClientIds.contains(clientId);
        }
        return result;
    }

    /**
     * 获取token的总有效时长
     * @param clientId 应用id
     */
    private int getAccessTokenValiditySeconds(String clientId) {

        ClientDetails clientDetails =  (ClientDetails) redisTemplate.opsForValue().get(SecurityConstants.CACHE_CLIENT_KEY + ":" + clientId);
        if (clientDetails.getAccessTokenValiditySeconds() != null) {
            return clientDetails.getAccessTokenValiditySeconds();
        }
        //返回默认值
        return SecurityConstants.ACCESS_TOKEN_VALIDITY_SECONDS;
    }

    @Override
    public OAuth2Authentication readAuthentication(String token) {
//        redisTemplate.opsForValue().get(SecurityConstants.REDIS_TOKEN_AUTH + token);
//
//        //JSONObject.toJavaObject(JSONObject.toJSON(redisTemplate.opsForValue().get(SecurityConstants.REDIS_TOKEN_AUTH + token).toString()) , OAuth2Authentication.class);
//        OAuth2Authentication oAuth2Authentication= (OAuth2Authentication) redisTemplate.opsForValue().get(SecurityConstants.REDIS_TOKEN_AUTH + token);
//        return oAuth2Authentication;
//        JSONObject jsonObject = JSONObject.parseObject(redisTemplate.opsForValue().get(SecurityConstants.REDIS_TOKEN_AUTH + token).toString());
//        System.out.println(jsonObject);
//        OAuth2Authentication oAuth2Authentication = JSONObject.parseObject(jsonObject.get("userAuthentication").toString() , OAuth2Authentication.class);
//        System.out.println(oAuth2Authentication.toString());

        OAuth2Authentication oAuth2Authentication= (OAuth2Authentication) redisTemplate.opsForValue().get(SecurityConstants.REDIS_TOKEN_AUTH + token);
        return oAuth2Authentication;
    }

    @Override
    public OAuth2Authentication readAuthenticationForRefreshToken(OAuth2RefreshToken token) {
        return readAuthenticationForRefreshToken(token.getValue());
    }

    public OAuth2Authentication readAuthenticationForRefreshToken(String token) {
        OAuth2Authentication oAuth2Authentication = (OAuth2Authentication) redisTemplate.opsForValue().get(REFRESH_AUTH + token);
        return oAuth2Authentication;
    }

    @Override
    public void storeAccessToken(OAuth2AccessToken token, OAuth2Authentication authentication) {
        storeAccessToken(token, authentication, false);
    }

    /**
     * 存储token
     * @param isRenew 是否续签
     */
    private void storeAccessToken(OAuth2AccessToken token, OAuth2Authentication authentication, boolean isRenew) {
            Object oldAccessToken = redisTemplate.opsForValue().get(ACCESS + token.getValue());
            //如果token已存在，并且不是续签的话直接返回
            if (!isRenew && oldAccessToken != null) {
                return;
            }

        redisTemplate.opsForValue().set(ACCESS + token.getValue(), token);
        redisTemplate.opsForValue().set(SecurityConstants.REDIS_TOKEN_AUTH + token, JSONObject.toJSONString(authentication));
        redisTemplate.opsForValue().set(AUTH_TO_ACCESS + authenticationKeyGenerator.extractKey(authentication), token);
            //如果是续签token，需要先删除集合里旧的值
            if (oldAccessToken != null) {
                if (!authentication.isClientOnly()) {
                    redisTemplate.opsForList().remove(SecurityConstants.REDIS_UNAME_TO_ACCESS + authentication, 1, oldAccessToken);
                }
                redisTemplate.opsForList().remove(SecurityConstants.REDIS_CLIENT_ID_TO_ACCESS + authentication.getOAuth2Request().getClientId(), 1, oldAccessToken);
            }
            if (!authentication.isClientOnly()) {
                redisTemplate.opsForList().rightPush(SecurityConstants.REDIS_UNAME_TO_ACCESS + authentication, token);
            }
            redisTemplate.opsForList().rightPush(SecurityConstants.REDIS_CLIENT_ID_TO_ACCESS + authentication.getOAuth2Request().getClientId(), authentication);
            if (token.getExpiration() != null) {
                int seconds = token.getExpiresIn();
                redisTemplate.expire(ACCESS + token.getValue(), seconds, TimeUnit.SECONDS);
                redisTemplate.expire(SecurityConstants.REDIS_TOKEN_AUTH + token.getValue(), seconds, TimeUnit.SECONDS);
                redisTemplate.expire(AUTH_TO_ACCESS + authenticationKeyGenerator.extractKey(authentication), seconds, TimeUnit.SECONDS);
                redisTemplate.expire(SecurityConstants.REDIS_CLIENT_ID_TO_ACCESS + authentication.getOAuth2Request().getClientId(), seconds, TimeUnit.SECONDS);
                redisTemplate.expire(SecurityConstants.REDIS_UNAME_TO_ACCESS + authentication, seconds, TimeUnit.SECONDS);

            }
            OAuth2RefreshToken refreshToken = token.getRefreshToken();
            if (refreshToken != null && refreshToken.getValue() != null) {
                this.redisTemplate.opsForValue().set(REFRESH_TO_ACCESS + token.getRefreshToken().getValue(), token.getValue());
                this.redisTemplate.opsForValue().set(ACCESS_TO_REFRESH + token.getValue(), token.getRefreshToken().getValue());

                if (refreshToken instanceof ExpiringOAuth2RefreshToken) {
                    ExpiringOAuth2RefreshToken expiringRefreshToken = (ExpiringOAuth2RefreshToken) refreshToken;
                    Date expiration = expiringRefreshToken.getExpiration();
                    if (expiration != null) {
                        int seconds = (int)((expiration.getTime() - System.currentTimeMillis()) / 1000L);

                        redisTemplate.expire(REFRESH_TO_ACCESS + token.getRefreshToken().getValue(), seconds, TimeUnit.SECONDS);
                        redisTemplate.expire(ACCESS_TO_REFRESH + token.getValue(), seconds, TimeUnit.SECONDS);
                    }
                }
            }


    }

    private static String getApprovalKey(OAuth2Authentication authentication) {
        String userName = authentication.getUserAuthentication() == null ? ""
                : authentication.getUserAuthentication().getName();
        return getApprovalKey(authentication.getOAuth2Request().getClientId(), userName);
    }

    private static String getApprovalKey(String clientId, String userName) {
        return clientId + (userName == null ? "" : ":" + userName);
    }

    @Override
    public void removeAccessToken(OAuth2AccessToken accessToken) {
        removeAccessToken(accessToken.getValue());
    }

    @Override
    public OAuth2AccessToken readAccessToken(String tokenValue) {
        OAuth2AccessToken oAuth2AccessToken = DefaultOAuth2AccessToken.valueOf((Map<String, String>) this.redisTemplate.opsForValue().get(ACCESS+ tokenValue));
        //OAuth2AccessToken oAuth2AccessToken = (OAuth2AccessToken)this.redisTemplate.opsForValue().get(ACCESS+ tokenValue);
        return  oAuth2AccessToken;
    }

    public void removeAccessToken(String tokenValue) {
        OAuth2Authentication authentication = (OAuth2Authentication) this.redisTemplate.opsForValue().get(ACCESS + tokenValue);
        this.redisTemplate.delete(ACCESS + tokenValue);
        redisTemplate.delete(ACCESS + tokenValue);
        redisTemplate.delete(SecurityConstants.REDIS_TOKEN_AUTH + tokenValue);
        this.redisTemplate.delete(ACCESS_TO_REFRESH + tokenValue);
        if (authentication != null) {
            this.redisTemplate.delete(AUTH_TO_ACCESS + authenticationKeyGenerator.extractKey(authentication));
            redisTemplate.opsForList().leftPop(SecurityConstants.REDIS_UNAME_TO_ACCESS + authentication + getApprovalKey(authentication.getOAuth2Request().getClientId(), authentication.getName()));
            redisTemplate.opsForList().leftPop(SecurityConstants.REDIS_CLIENT_ID_TO_ACCESS + authentication.getOAuth2Request().getClientId());
            this.redisTemplate.delete(AUTH_TO_ACCESS + authenticationKeyGenerator.extractKey(authentication));
        }
    }

    @Override
    public void storeRefreshToken(OAuth2RefreshToken refreshToken, OAuth2Authentication authentication) {
        this.redisTemplate.opsForValue().set(REFRESH + refreshToken.getValue(), refreshToken);
        this.redisTemplate.opsForValue().set(REFRESH_AUTH + refreshToken.getValue(), authentication);
    }

//    private void expireRefreshToken(OAuth2RefreshToken refreshToken, RedisConnection conn, byte[] refreshKey, byte[] refreshAuthKey) {
//        if (refreshToken instanceof ExpiringOAuth2RefreshToken) {
//            ExpiringOAuth2RefreshToken expiringRefreshToken = (ExpiringOAuth2RefreshToken) refreshToken;
//            Date expiration = expiringRefreshToken.getExpiration();
//            if (expiration != null) {
//                int seconds = Long.valueOf((expiration.getTime() - System.currentTimeMillis()) / 1000L)
//                        .intValue();
//                conn.expire(refreshKey, seconds);
//                conn.expire(refreshAuthKey, seconds);
//            }
//        }
//    }

    @Override
    public OAuth2RefreshToken readRefreshToken(String tokenValue) {
        return (OAuth2RefreshToken) this.redisTemplate.opsForValue().get(REFRESH + tokenValue);
    }

    @Override
    public void removeRefreshToken(OAuth2RefreshToken refreshToken) {
        removeRefreshToken(refreshToken.getValue());
    }

    public void removeRefreshToken(String tokenValue) {
        this.redisTemplate.delete(REFRESH + tokenValue);
        this.redisTemplate.delete(REFRESH_AUTH + tokenValue);
        this.redisTemplate.delete(REFRESH_TO_ACCESS + tokenValue);
        this.redisTemplate.delete(ACCESS_TO_REFRESH + tokenValue);
    }

    @Override
    public void removeAccessTokenUsingRefreshToken(OAuth2RefreshToken refreshToken) {
        removeAccessTokenUsingRefreshToken(refreshToken.getValue());
    }

    private void removeAccessTokenUsingRefreshToken(String refreshToken) {
        String token = (String) this.redisTemplate.opsForValue().get(REFRESH_TO_ACCESS + refreshToken);
        if (token != null) {
            redisTemplate.delete(REFRESH_TO_ACCESS + refreshToken);
        }
    }

    @Override
    public Collection<OAuth2AccessToken> findTokensByClientIdAndUserName(String clientId, String userName) {
        List<Object> result = redisTemplate.opsForList().range(SecurityConstants.REDIS_UNAME_TO_ACCESS + getApprovalKey(clientId, userName), 0, -1);
        return getTokenCollections(result);
    }

    @Override
    public Collection<OAuth2AccessToken> findTokensByClientId(String clientId) {
        List<Object> result = redisTemplate.opsForList().range((SecurityConstants.REDIS_CLIENT_ID_TO_ACCESS + clientId), 0, -1);
        return getTokenCollections(result);
    }

    private Collection<OAuth2AccessToken> getTokenCollections(List<Object> result) {
        if (result == null || result.isEmpty()) {
            return Collections.emptySet();
        }
        List<OAuth2AccessToken> accessTokens = new ArrayList<>(result.size());
        for (Iterator<Object> it = result.iterator(); it.hasNext(); ) {
            OAuth2AccessToken accessToken = (OAuth2AccessToken) it.next();
            accessTokens.add(accessToken);
        }
        return Collections.unmodifiableCollection(accessTokens);
    }
}
