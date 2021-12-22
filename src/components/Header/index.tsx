import Link from 'next/link';
import styles from './header.module.scss';

export default function Header(): JSX.Element {
  // TODO
  return (
    <header className={styles.container}>
      <div>
        <Link href="/">
          <a>
            <img src="/images/logo.svg" alt="Logo" />
          </a>
        </Link>
      </div>
    </header>
  );
}
