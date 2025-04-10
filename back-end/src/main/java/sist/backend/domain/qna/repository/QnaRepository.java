package sist.backend.domain.qna.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import sist.backend.domain.qna.entity.Qna;

public interface QnaRepository extends JpaRepository<Qna, Long> {

}
