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
import com.workmates.backend.repository.ThreadRepository;

@Service
@RequiredArgsConstructor
@Transactional
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final ThreadRepository threadRepository;

    @Transactional(readOnly = true)
    public Page<CommentDto.Response> list(Long wid, Long tid, Long pid, Pageable pageable) {
        ensurePathOrThrow(wid, tid, pid);
        return commentRepository.pageByPostIdOrderByThreaded(pid, pageable)
                .map(CommentDto.Response::from);
    }

    public CommentDto.Response create(Long wid, Long tid, Long pid,
                                      String userId, String nickname, CommentDto.CreateRequest req) {
        ensurePathOrThrow(wid, tid, pid);

        Long rootId = null; int depth = 0;
        if (req.getParentId() != null) {
            Comment parent = commentRepository.findById(req.getParentId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Parent comment not found"));
            if (!parent.getPostId().equals(pid))
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Parent belongs to another post");
            rootId = parent.getRootId() != null ? parent.getRootId() : parent.getId();
            depth = parent.getDepth() + 1;
        }

        String nick = (nickname == null || nickname.isBlank()) ? userId : nickname;

        Comment saved = commentRepository.save(Comment.builder()
            .postId(pid)
            .rootId(rootId)
            .depth(depth)
            .content(req.getContent().trim())
            .attachmentUrl(req.getAttachmentUrl())
            .writerId(userId)
            .writerNickname(nick)
            .build());

        return CommentDto.Response.from(saved);
    }

    public CommentDto.Response update(Long wid, Long tid, Long pid,
                                      Long commentId, String userId, CommentDto.UpdateRequest req) {
        ensurePathOrThrow(wid, tid, pid);

        Comment c = commentRepository.findById(commentId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found"));

        if (!c.getPostId().equals(pid))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mismatched postId");
        if (Boolean.TRUE.equals(c.getIsDeleted()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Already deleted");
        if (!c.getWriterId().equals(userId))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not owner");

        c.setContent(req.getContent().trim());
        if (req.getAttachmentUrl() != null) c.setAttachmentUrl(req.getAttachmentUrl());
        return CommentDto.Response.from(c);
    }

    public void delete(Long wid, Long tid, Long pid, Long commentId, String userId) {
        ensurePathOrThrow(wid, tid, pid);

        Comment c = commentRepository.findById(commentId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found"));

        if (!c.getPostId().equals(pid))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mismatched postId");
        if (!c.getWriterId().equals(userId))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not owner");
        if (Boolean.TRUE.equals(c.getIsDeleted())) return;

        c.setIsDeleted(true);
        c.setContent("");
        c.setAttachmentUrl(null);
    }

    private void ensurePathOrThrow(Long wid, Long tid, Long pid) {
        // post ∈ thread ?
        if (!postRepository.existsByIdAndThreadId(pid, tid))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not in thread");
        // thread ∈ workshop ?
        if (!threadRepository.existsByIdAndWorkshopId(tid, wid))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Thread not in workshop");
    }
}