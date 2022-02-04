import {Link} from 'remix';

export default function Index() {
  return (
    <div className="container mx-auto">
      <header className="my-2">
        <h1 className="text-2xl">Amazing website</h1>
        <ul>
          <li className="inline mr-2"><Link to="/">Blog</Link></li>
          <li className="inline mr-2"><Link to="/">Projects</Link></li>
          <li className="inline"><Link to="/">Links</Link></li>
        </ul>
      </header>
      <main>
        <p>
          Hello, world!
        </p>
      </main>
    </div>
  );
}
