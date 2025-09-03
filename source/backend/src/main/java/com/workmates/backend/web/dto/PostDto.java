public class PostDto {

    @Getter
    @Setter
    public static class Response {
        private Long id;
        private String title;
        private String content;
        private String writerNickname;
        private Integer views;
        private String createdAt;

        public static Response from(Post post) {
            Response dto = new Response();
            dto.setId(post.getId());
            dto.setTitle(post.getTitle());
            dto.setContent(post.getContent());
            dto.setWriterNickname(post.getWriterNickname());
            dto.setViews(post.getViews());
            dto.setCreatedAt(post.getCreatedAt().toString());
            return dto;
        }
    }

    @Getter
    @Setter
    public static class CommentRequest {
        private String content;
    }

    @Getter
    @Setter
    public static class CommentResponse {
        private Long id;
        private String content;
        private String writerNickname;
        private String createdAt;

        public static CommentResponse from(Comment comment) {
            CommentResponse dto = new CommentResponse();
            dto.setId(comment.getId());
            dto.setContent(comment.getContent());
            dto.setWriterNickname(comment.getWriterNickname());
            dto.setCreatedAt(comment.getCreatedAt().toString());
            return dto;
        }
    }
}
