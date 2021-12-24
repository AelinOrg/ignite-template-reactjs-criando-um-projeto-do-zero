/* eslint-disable react/no-danger */
import { GetStaticPaths, GetStaticProps } from 'next';

import Head from 'next/head';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AiOutlineCalendar } from 'react-icons/ai';
import { FiUser } from 'react-icons/fi';
import { FaRegClock } from 'react-icons/fa';
import { RichText } from 'prismic-dom';
import Prismic from '@prismicio/client';
import { useRouter } from 'next/router';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({
  post: {
    data: { title, author, content, banner },
    first_publication_date,
  },
}: PostProps): JSX.Element {
  // TODO
  const router = useRouter();
  const timeReading: number = Math.ceil(
    (content.reduce(
      (counter: number, { body }) =>
        counter +
        RichText.asText(body)
          .split(/[ ,;:.?!()]+/)
          .filter(word => word).length,
      0
    ) *
      10) /
      10 /
      200
  );

  const createdAt = format(new Date(first_publication_date), 'dd LLL yyyy', {
    locale: ptBR,
  });

  return (
    <>
      <Head>
        <title>{title} | spacetraveling</title>
      </Head>
      {!router.isFallback ? (
        <main className={`${commonStyles.commonContainer} ${styles.container}`}>
          <header className={styles.header}>
            {banner.url && (
              <div className={styles.banner}>
                <img src={banner.url} alt="Banner" />
              </div>
            )}

            <h1>{title}</h1>

            <div className={commonStyles.postMeta}>
              <div className={commonStyles.responsiveBreakLine}>
                <span>
                  <AiOutlineCalendar strokeWidth="50" size="20" />
                  {createdAt}
                </span>
                <span>
                  <FiUser strokeWidth="3" size="20" />
                  {author}
                </span>
                <span>
                  <FaRegClock strokeWidth="3" size="20" />
                  {timeReading} min
                </span>
              </div>
            </div>
          </header>

          <article className={styles.article}>
            {content.map(({ heading, body }) => (
              <section key={heading}>
                <h2>{heading}</h2>
                <div
                  dangerouslySetInnerHTML={{
                    __html: RichText.asHtml(body),
                  }}
                />
              </section>
            ))}
          </article>
        </main>
      ) : (
        <div className={styles.loading}>Carregando...</div>
      )}
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();

  const posts = await prismic.query(
    Prismic.predicates.at('document.type', 'posts')

    // TODO
  );
  return {
    paths: posts.results.map(post => ({ params: { slug: post.uid } })),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params: { slug } }) => {
  const prismic = getPrismicClient();

  const post = (await prismic.getByUID('posts', String(slug), {})) as Post;

  // TODO
  return {
    props: {
      post: {
        ...post,
        data: { ...post.data, author: post.data.author ?? 'Unknown' },
      },
    },
    revalidate: 60 * 60 * 24, // 24 horas
  };
};
