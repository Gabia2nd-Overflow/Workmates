@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final JwtUtil jwtUtil;

    // 게시글 조회
    public Post getPostById(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글이 없습니다."));
    }

    // 조회수 증가
    @Transactional
    public void increaseViews(Long postId) {
        Post post = getPostById(postId);
        post.setViews(post.getViews() + 1);
    }

    // 댓글 조회
    public List<PostDto.CommentResponse> getComments(Long postId) {
        return commentRepository.findByPostId(postId)
                .stream()
                .map(PostDto.CommentResponse::from)
                .toList();
    }

    // 댓글 작성
    @Transactional
    public PostDto.CommentResponse createComment(Long postId, PostDto.CommentRequest request, String token) {
        String nickname = jwtUtil.extractNickname(token);
        Post post = getPostById(postId);

        Comment comment = Comment.builder()
                .post(post)
                .content(request.getContent())
                .writerNickname(nickname)
                .build();

        commentRepository.save(comment);

        return PostDto.CommentResponse.from(comment);
    }
}
