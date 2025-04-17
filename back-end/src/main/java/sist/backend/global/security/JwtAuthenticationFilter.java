package sist.backend.global.security;

import sist.backend.global.jwt.JwtProvider;
import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String uri = request.getRequestURI();
        String header = request.getHeader("Authorization");
        System.out.println("[JWT] 요청 URI: " + uri);
        if (header != null && header.startsWith("Bearer ")) {
            String jwt = header.substring(7);
            String userEmail = null;
            try {
                userEmail = jwtProvider.extractUsername(jwt);
                System.out.println("[JWT] userEmail 추출: " + userEmail);
            } catch (Exception e) {
                System.out.println("[JWT] Username 추출 실패: " + e.getMessage());
            }

            Authentication existingAuth = SecurityContextHolder.getContext().getAuthentication();
if (existingAuth != null) {
    System.out.println("[JWT] 기존 Authentication principal: " + existingAuth.getPrincipal());
    System.out.println("[JWT] 기존 Authentication class: " + existingAuth.getClass().getName());
}
if (userEmail != null && (existingAuth == null ||
    existingAuth.getPrincipal() == null ||
    "anonymousUser".equals(existingAuth.getPrincipal()) ||
    !(existingAuth.getPrincipal() instanceof UserDetails))) {
                try {
                    UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
                    System.out.println("[JWT] UserDetailsService 조회 성공: " + userDetails.getUsername());
                    if (jwtProvider.validateToken(jwt, userDetails)) {
                        System.out.println("[JWT] 토큰 유효성 검증 성공");
                        // principal을 UserDetails(User)로 명확하게 세팅
                        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        System.out.println("[JWT] SecurityContextHolder에 인증 객체 세팅 완료");
                    } else {
                        System.out.println("[JWT] 토큰 유효성 검증 실패");
                    }
                } catch (Exception e) {
                    System.out.println("[JWT] UserDetailsService 조회 또는 토큰 검증 실패: " + e.getMessage());
                }
            } else {
                System.out.println("[JWT] userEmail이 null이거나 이미 인증됨");
            }
        } else {
            System.out.println("[JWT] Authorization 헤더 없음 또는 Bearer 형식 아님 (URI: " + uri + ")");
        }
        chain.doFilter(request, response);
    }
} 