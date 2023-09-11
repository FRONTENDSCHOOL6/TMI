import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import S from './Heading.module.css';

function Heading() {
  return (
    <div className={S.HeadingWrapper}>
      <h1>
        <Link href="/">
          <Logo size={60} />
        </Link>
      </h1>
    </div>
  );
}

export default Heading;
