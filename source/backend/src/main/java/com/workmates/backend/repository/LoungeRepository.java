package com.workmates.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.workmates.backend.domain.Lounge;

@Repository
public interface LoungeRepository extends JpaRepository<Lounge, Long>{
    // @Override
    // default <S extends Chatroom> S save(S entity) {
    //     // TODO Auto-generated method stub
    //     throw new UnsupportedOperationException("Unimplemented method 'save'");
    // }

    // @Override
    // default <S extends Chatroom> Page<S> findAll(Example<S> example, Pageable pageable) {
    //     // TODO Auto-generated method stub
    //     throw new UnsupportedOperationException("Unimplemented method 'findAll'");
    // }

    // @Override
    // default Optional<Chatroom> findById(Long id) {
    //     // TODO Auto-generated method stub
    //     throw new UnsupportedOperationException("Unimplemented method 'findById'");
    // }

    // @Override
    // default void deleteById(Long id) {
    //     // TODO Auto-generated method stub
    //     throw new UnsupportedOperationException("Unimplemented method 'deleteById'");
    // }

    //이 4가지가 원래는 생략해도 모두 기본 제공. 단 사용하면 에러뜨니 사용하지말것.
}
