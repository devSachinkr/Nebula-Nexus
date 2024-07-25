import React from "react";
import Typography from "../global/typography";

type Props = {
  title: string;
  description?: string;
  pill: string;
};

const Title = ({ pill, title, description }: Props) => {
  return (
    <React.Fragment>
      <section className="flex flex-col gap-4 justify-center items-start md:items-center">
        <article className="rounded-full p-[1px] text-sm dark:bg-gradient-to-r dark:from-brand-primaryBlue dark:to-brand-primaryPurple">
          <div className="rounded-full px-3 py-1 dark:bg-black">{pill}</div>
        </article>
        {description ? (
          <>
            <Typography
              text={title}
              variant="h2"
              className="sm:text-5xl sm:max-w-[750px] md:text-center"
            />
            <Typography
              variant="p"
              text={description}
              className="dark:text-washed-purple-700 sm:max-w-[450px] text-center"
            />
          </>
        ) : (
          <Typography
            variant="h1"
            className="sm:text-6xl sm:max-w-[850px] md:text-center overflow-hidden"
            text={title}
          />
        )}
      </section>
    </React.Fragment>
  );
};

export default Title;
