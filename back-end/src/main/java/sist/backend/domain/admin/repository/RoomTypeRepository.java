package sist.backend.domain.admin.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import sist.backend.domain.admin.entity.RoomType;

public interface RoomTypeRepository extends JpaRepository<RoomType, Long> {
}
