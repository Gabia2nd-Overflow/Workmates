package com.workmates.backend.service;

import com.workmates.backend.domain.Comment;
import com.workmates.backend.web.dto.CommentDto;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.workmates.backend.repository.CommentRepository;
import com.workmates.backend.repository.PostRepository;

@Service
@RequiredArgsConstructor
@Transactional
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;

    @Transactional(readOnly = true)
    public Page<CommentDto.Response> list(Long workshopId, Long threadId, Long postId, Pageable pageable) {
        ensurePostHierarchyOrThrow(workshopId, threadId, postId);
        return commentRepository
            .findByPostIdAndIsDeletedFalseOrderByIdAsc(postId, pageable)
            .map(CommentDto.Response::from);
    }

    public CommentDto.Response create(Long workshopId, Long threadId, Long postId,
                                      String userId, String nickname, CommentDto.CreateRequest req) {
        ensurePostHierarchyOrThrow(workshopId, threadId, postId);

        // 부모/깊이 계산
        Long rootId = null;
        int depth = 0;
        if (req.getParentId() != null) {
            Comment parent = commentRepository.findById(req.getParentId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Parent comment not found"));
            if (!parent.getPostId().equals(postId))
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Parent belongs to another post");
            rootId = parent.getRootId() != null ? parent.getRootId() : parent.getId();
            depth = parent.getDepth() + 1;
        }

        String nick = (nickname == null || nickname.isBlank()) ? userId : nickname;

        Comment saved = commentRepository.save(
            Comment.builder()
                .postId(postId)
                .rootId(rootId)
                .depth(depth)
                .content(req.getContent().trim())
                .attachmentUrl(req.getAttachmentUrl())
                .writerId(userId)
                .writerNickname(nick)
                .build()
        );
        return CommentDto.Response.from(saved);
    }

    public CommentDto.Response update(Long workshopId, Long threadId, Long postId,
                                      Long commentId, String userId, CommentDto.UpdateRequest req) {
        ensurePostHierarchyOrThrow(workshopId, threadId, postId);

        Comment c = commentRepository.findById(commentId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found"));

        if (!c.getPostId().equals(postId))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mismatched postId");
        if (Boolean.TRUE.equals(c.getIsDeleted()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Already deleted");
        if (!c.getWriterId().equals(userId))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not owner");

        c.setContent(req.getContent().trim());
        if (req.getAttachmentUrl() != null) c.setAttachmentUrl(req.getAttachmentUrl());
        return CommentDto.Response.from(c);
    }

    public void delete(Long workshopId, Long threadId, Long postId, Long commentId, String userId) {
        ensurePostHierarchyOrThrow(workshopId, threadId, postId);

        Comment c = commentRepository.findById(commentId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found"));

        if (!c.getPostId().equals(postId))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mismatched postId");
        if (!c.getWriterId().equals(userId))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not owner");
        if (Boolean.TRUE.equals(c.getIsDeleted())) return; // 멱등

        c.setIsDeleted(true);
        c.setContent("");
        c.setAttachmentUrl(null);
    }

    private void ensurePostHierarchyOrThrow(Long workshopId, Long threadId, Long postId) {
        boolean ok = postRepository.existsByIdAndThreadIdAndWorkshopId(postId, threadId, workshopId);
        if (!ok) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found in given path");
    }
}