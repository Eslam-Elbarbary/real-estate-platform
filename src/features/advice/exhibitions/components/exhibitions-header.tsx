import { exhibitionCopy } from '../config';

export function ExhibitionsHeader() {
  return (
    <header className="mt-6 border-b border-[#ececec] pb-5">
      <h1 className="text-2xl font-extrabold text-ink-950 sm:text-[1.85rem]">
        {exhibitionCopy.directoryTitle}
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-7 text-ink-600">
        {exhibitionCopy.directoryIntro}
      </p>
    </header>
  );
}
