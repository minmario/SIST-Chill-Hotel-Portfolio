package sist.backend.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.querydsl.jpa.impl.JPAQueryFactory;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

/**
 * QueryDSL 설정 클래스
 * JPAQueryFactory를 빈으로 등록하여 프로젝트 전역에서 QueryDSL을 사용할 수 있게 합니다.
 */
@Configuration
public class QuerydslConfig {
    
    @PersistenceContext
    private EntityManager entityManager;
    
    @Bean
    public JPAQueryFactory jpaQueryFactory() {
        return new JPAQueryFactory(entityManager);
    }
} 