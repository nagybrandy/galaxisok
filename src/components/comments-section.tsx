// src/components/comments-section.tsx
// Anonymous threaded comments with moderation feedback, sorting, replies, and refresh.

"use client";

import {
  Check,
  ChevronDown,
  Copy,
  LoaderCircle,
  MessageCircle,
  RefreshCw,
  Reply,
  Send,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  type CSSProperties,
  type FormEvent,
  useMemo,
  useRef,
  useState,
} from "react";

import type { BlogComment } from "@/lib/comments";

const COMMENTS_PER_PAGE = 6;
const MAX_COMMENT_LENGTH = 2_000;

type CommentsSectionProps = {
  postId: number;
  initialComments: BlogComment[];
};

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

type SortOrder = "oldest" | "newest";

type CommentItemProps = {
  comment: BlogComment;
  replies: Map<number, BlogComment[]>;
  depth?: number;
  onReply: (comment: BlogComment) => void;
};

function formatCommentDate(value: string): string {
  return new Intl.DateTimeFormat("hu-HU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Budapest",
  }).format(new Date(value));
}

function CommentItem({
  comment,
  replies,
  depth = 0,
  onReply,
}: CommentItemProps) {
  const children = replies.get(comment.id) ?? [];
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    const url = `${window.location.origin}${window.location.pathname}#comment-${comment.id}`;
    await navigator.clipboard.writeText(url);
    window.history.replaceState(null, "", `#comment-${comment.id}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1_600);
  }

  return (
    <li
      id={`comment-${comment.id}`}
      className="comment-item"
      style={{ "--comment-depth": Math.min(depth, 3) } as CSSProperties}
    >
      <article className="comment-paper">
        <header className="comment-head">
          <div>
            <p className="comment-author">
              {comment.authorName}
              {comment.isAdmin ? (
                <span className="comment-admin-badge"> (admin)</span>
              ) : null}
            </p>
            <time className="comment-date" dateTime={comment.date}>
              {formatCommentDate(comment.date)}
            </time>
          </div>
          <span className="comment-number" aria-hidden>
            #{comment.id}
          </span>
        </header>
        <p className="comment-content">{comment.content}</p>
        <footer className="comment-actions">
          <button type="button" onClick={() => onReply(comment)}>
            <Reply aria-hidden />
            Válasz
          </button>
          <button type="button" onClick={copyLink}>
            {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
            {copied ? "Másolva" : "Link másolása"}
          </button>
        </footer>
      </article>
      {children.length > 0 ? (
        <ol className="comment-replies">
          {children.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              replies={replies}
              depth={depth + 1}
              onReply={onReply}
            />
          ))}
        </ol>
      ) : null}
    </li>
  );
}

export function CommentsSection({
  postId,
  initialComments,
}: CommentsSectionProps) {
  const [comments, setComments] = useState(initialComments);
  const [sortOrder, setSortOrder] = useState<SortOrder>("oldest");
  const [visibleCount, setVisibleCount] = useState(COMMENTS_PER_PAGE);
  const [replyTo, setReplyTo] = useState<BlogComment | null>(null);
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [content, setContent] = useState("");
  const [company, setCompany] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>({
    status: "idle",
  });
  const [refreshing, setRefreshing] = useState(false);
  const startedAtRef = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);

  const { roots, replies } = useMemo(() => {
    const replyMap = new Map<number, BlogComment[]>();
    const rootComments: BlogComment[] = [];
    const ids = new Set(comments.map((comment) => comment.id));

    for (const comment of comments) {
      if (comment.parentId > 0 && ids.has(comment.parentId)) {
        const group = replyMap.get(comment.parentId) ?? [];
        group.push(comment);
        replyMap.set(comment.parentId, group);
      } else {
        rootComments.push(comment);
      }
    }

    const direction = sortOrder === "oldest" ? 1 : -1;
    rootComments.sort(
      (a, b) =>
        direction *
        (new Date(a.date).getTime() - new Date(b.date).getTime()),
    );
    for (const group of replyMap.values()) {
      group.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );
    }

    return { roots: rootComments, replies: replyMap };
  }, [comments, sortOrder]);

  const visibleRoots = roots.slice(0, visibleCount);

  function selectReply(comment: BlogComment) {
    setReplyTo(comment);
    setSubmitState({ status: "idle" });
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  async function refreshComments() {
    setRefreshing(true);
    try {
      const response = await fetch(`/api/comments?postId=${postId}`, {
        cache: "no-store",
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        comments?: BlogComment[];
      };
      if (response.ok && payload.ok && payload.comments) {
        setComments(payload.comments);
      }
    } finally {
      setRefreshing(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState({ status: "submitting" });

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          parentId: replyTo?.id ?? 0,
          authorName,
          authorEmail,
          content,
          company,
          startedAt: startedAtRef.current,
        }),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        message?: string;
      };

      if (!response.ok || !payload.ok) {
        setSubmitState({
          status: "error",
          message: payload.message || "A hozzászólást nem sikerült elküldeni.",
        });
        return;
      }

      setContent("");
      setReplyTo(null);
      setSubmitState({
        status: "success",
        message:
          payload.message ||
          "Köszönjük! A hozzászólás adminisztrátori jóváhagyásra vár.",
      });
      startedAtRef.current = 0;
    } catch {
      setSubmitState({
        status: "error",
        message: "Hálózati hiba történt. Próbáld újra később.",
      });
    }
  }

  return (
    <section className="comments-section" aria-labelledby="comments-title">
      <div className="comments-heading">
        <div>
          <p className="comments-kicker">Beszélgessünk</p>
          <h2 id="comments-title">
            Hozzászólások
            <span>{comments.length}</span>
          </h2>
        </div>
        <div className="comments-tools">
          <label>
            <span className="sr-only">Hozzászólások sorrendje</span>
            <select
              value={sortOrder}
              onChange={(event) => {
                setSortOrder(event.target.value as SortOrder);
                setVisibleCount(COMMENTS_PER_PAGE);
              }}
            >
              <option value="oldest">Legrégebbiek</option>
              <option value="newest">Legújabbak</option>
            </select>
            <ChevronDown aria-hidden />
          </label>
          <button
            type="button"
            className="comments-refresh"
            onClick={refreshComments}
            disabled={refreshing}
            aria-label="Hozzászólások frissítése"
          >
            <RefreshCw className={refreshing ? "is-spinning" : ""} aria-hidden />
          </button>
        </div>
      </div>

      {comments.length === 0 ? (
        <div className="comments-empty">
          <MessageCircle aria-hidden />
          <p>Még nincs hozzászólás. Legyél te az első!</p>
        </div>
      ) : (
        <>
          <ol className="comment-list">
            {visibleRoots.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                replies={replies}
                onReply={selectReply}
              />
            ))}
          </ol>
          {visibleRoots.length < roots.length ? (
            <button
              type="button"
              className="comments-more"
              onClick={() =>
                setVisibleCount((count) => count + COMMENTS_PER_PAGE)
              }
            >
              További hozzászólások
            </button>
          ) : null}
        </>
      )}

      <form
        ref={formRef}
        className="comment-form"
        onFocusCapture={() => {
          if (startedAtRef.current === 0) {
            startedAtRef.current = Date.now();
          }
        }}
        onSubmit={submit}
      >
        <div className="comment-form-heading">
          <div>
            <p className="comments-kicker">
              {replyTo ? "Válasz írása" : "Szólj hozzá"}
            </p>
            <h3>
              {replyTo
                ? `Válasz neki: ${replyTo.authorName}`
                : "Írd meg, mit gondolsz"}
            </h3>
          </div>
          {replyTo ? (
            <button
              type="button"
              className="comment-reply-cancel"
              onClick={() => setReplyTo(null)}
            >
              <X aria-hidden />
              Mégse
            </button>
          ) : null}
        </div>

        <div className="comment-identity">
          <label>
            <span>Név</span>
            <input
              name="authorName"
              autoComplete="name"
              required
              minLength={2}
              maxLength={80}
              value={authorName}
              onChange={(event) => setAuthorName(event.target.value)}
            />
          </label>
          <label>
            <span>Email</span>
            <input
              name="authorEmail"
              type="email"
              autoComplete="email"
              required
              value={authorEmail}
              onChange={(event) => setAuthorEmail(event.target.value)}
            />
            <small>Nem jelenik meg nyilvánosan.</small>
          </label>
        </div>

        <label className="comment-message">
          <span>Hozzászólás</span>
          <textarea
            name="content"
            required
            minLength={3}
            maxLength={MAX_COMMENT_LENGTH}
            rows={6}
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
          <small>
            {content.length} / {MAX_COMMENT_LENGTH}
          </small>
        </label>

        <label className="comment-honeypot" aria-hidden>
          Cég
          <input
            name="company"
            tabIndex={-1}
            autoComplete="off"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
          />
        </label>

        <label className="comment-consent">
          <input
            type="checkbox"
            required
            checked={privacyAccepted}
            onChange={(event) => setPrivacyAccepted(event.target.checked)}
          />
          <span>
            Hozzájárulok, hogy a nevem és a hozzászólásom nyilvánosan
            megjelenjen, az e-mail-címemet pedig a moderáláshoz kezeljék.{" "}
            <Link href="/adatkezeles">Adatkezelési tájékoztató</Link>
          </span>
        </label>

        <div className="comment-submit-row">
          <p>
            Minden hozzászólást jóváhagyunk, mielőtt megjelenik az oldalon.
          </p>
          <button
            type="submit"
            className="comment-submit"
            disabled={
              submitState.status === "submitting" || !privacyAccepted
            }
          >
            {submitState.status === "submitting" ? (
              <LoaderCircle className="is-spinning" aria-hidden />
            ) : (
              <Send aria-hidden />
            )}
            Küldés
          </button>
        </div>

        {submitState.status === "success" ||
        submitState.status === "error" ? (
          <p
            className={`comment-feedback is-${submitState.status}`}
            role="status"
          >
            {submitState.message}
          </p>
        ) : null}
      </form>
    </section>
  );
}
