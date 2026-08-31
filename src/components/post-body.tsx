// src/components/post-body.tsx
// Renders sanitized WordPress HTML with readable article typography.

type PostBodyProps = {
  html: string;
};

export function PostBody({ html }: PostBodyProps) {
  return (
    <div
      className="post-body max-w-none overflow-x-auto text-[1.05rem] leading-8 text-white/85 [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:border-l-2 [&_blockquote]:border-white/20 [&_blockquote]:pl-4 [&_blockquote]:italic [&_figcaption]:mt-2 [&_figcaption]:text-sm [&_figcaption]:text-white/45 [&_figure]:my-8 [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:font-normal [&_h2]:text-2xl [&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:font-normal [&_h3]:text-xl [&_iframe]:my-8 [&_iframe]:aspect-video [&_iframe]:w-full [&_img]:my-8 [&_img]:h-auto [&_img]:w-full [&_li]:my-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol_ul]:mt-2 [&_ul_ul]:mt-2"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
