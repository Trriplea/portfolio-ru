import { Fragment } from 'react';
import { DecoderText } from './DecoderText';
import { OptimizedImage } from './OptimizedImage';
import { getRoutePath, withBasePath } from '../lib/basePath';

type ProjectSlide = {
  imageUrl?: string;
  imageAlt: string;
  imageClassName?: string;
  coverLabel?: string;
};

type PortfolioProject = {
  title: string;
  year?: string;
  description?: string;
  href?: string;
  imageUrl?: string;
  imageAlt?: string;
  imageClassName?: string;
  ratio?: string;
  mobileRatio?: string;
  coverLabel?: string;
  additionalSlides?: ProjectSlide[];
};

type ExperienceItem = {
  label: string;
  period: string;
};

const portfolioProjects: PortfolioProject[] = [
  {
    title: 'ARTEL',
    coverLabel: 'artel',
    additionalSlides: [
      {
        imageAlt: 'ARTEL architecture bureau website home page',
        imageUrl: '/projects/artel/screen-12.jpg',
      },
      {
        imageAlt: 'ARTEL architecture bureau project overview',
        imageUrl: '/projects/artel/screen-13.jpg',
      },
      {
        imageAlt: 'ARTEL architecture bureau project grid',
        imageUrl: '/projects/artel/screen-14.jpg',
      },
      {
        imageAlt: 'ARTEL architecture bureau work archive',
        imageUrl: '/projects/artel/screen-15.jpg',
      },
      {
        imageAlt: 'ARTEL architecture bureau project detail',
        imageUrl: '/projects/artel/screen-16.jpg',
      },
      {
        imageAlt: 'ARTEL architecture bureau case study',
        imageUrl: '/projects/artel/screen-17.jpg',
      },
      {
        imageAlt: 'ARTEL architecture bureau about page',
        imageUrl: '/projects/artel/screen-18.jpg',
      },
    ],
    description:
      'Website for an architecture bureau with a restrained visual system, clean project presentation, and responsive front-end implementation.',
    href: '/projects/artel',
    mobileRatio: 'max-[500px]:aspect-[4/5]',
    ratio: 'aspect-[16/9]',
  },
  {
    title: 'TOTO',
    additionalSlides: [
      {
        imageAlt: 'TOTO website visual identity page',
        imageClassName: 'bg-white object-contain',
        imageUrl: '/projects/toto/screen-02.jpg',
      },
      {
        imageAlt: 'TOTO online store catalog',
        imageClassName: 'bg-white object-contain',
        imageUrl: '/projects/toto/screen-03.jpg',
      },
      {
        imageAlt: 'TOTO online store product collection',
        imageClassName: 'bg-white object-contain',
        imageUrl: '/projects/toto/screen-04.jpg',
      },
      {
        imageAlt: 'TOTO website story page',
        imageClassName: 'bg-white object-contain',
        imageUrl: '/projects/toto/screen-05.jpg',
      },
      {
        imageAlt: 'TOTO website editorial page',
        imageClassName: 'bg-white object-contain',
        imageUrl: '/projects/toto/screen-06.jpg',
      },
      {
        imageAlt: 'TOTO website graphic page',
        imageClassName: 'bg-white object-contain',
        imageUrl: '/projects/toto/screen-07.jpg',
      },
      {
        imageAlt: 'TOTO online store product page',
        imageClassName: 'bg-white object-contain',
        imageUrl: '/projects/toto/screen-08.jpg',
      },
      {
        imageAlt: 'TOTO empty cart page',
        imageClassName: 'bg-white object-contain',
        imageUrl: '/projects/toto/screen-09.jpg',
      },
      {
        imageAlt: 'TOTO shopping cart page',
        imageClassName: 'bg-white object-contain',
        imageUrl: '/projects/toto/screen-10.jpg',
      },
    ],
    description:
      'Website for TOTO Moscow, a local wine bar and neighborhood project with a warm visual tone, simple navigation, and a focused digital presence.',
    href: '/projects/toto',
    imageAlt: 'TOTO Moscow wine bar table with bottles and glasses',
    imageUrl: '/projects/toto-cover.png',
    mobileRatio: 'max-[500px]:aspect-[2/3]',
    ratio: 'aspect-[3/4]',
  },
  {
    title: 'FLAMEBAKER',
    additionalSlides: [
      {
        imageAlt: 'FLAMEBAKER online store catalog',
        imageClassName: 'bg-white object-contain',
        imageUrl: '/projects/flamebaker/screen-20.jpg',
      },
      {
        imageAlt: 'FLAMEBAKER online store collection page',
        imageClassName: 'bg-white object-contain',
        imageUrl: '/projects/flamebaker/screen-21.jpg',
      },
      {
        imageAlt: 'FLAMEBAKER online store product page',
        imageClassName: 'bg-white object-contain',
        imageUrl: '/projects/flamebaker/screen-22.jpg',
      },
    ],
    description:
      'Website for FLAMEBAKER, an independent clothing store with a bold visual language, product-focused catalog, and responsive storefront experience.',
    href: '/projects/flamebaker',
    imageAlt: 'FLAMEBAKER illustrated sticker character with red hair',
    imageClassName: 'object-contain',
    imageUrl: '/projects/flamebaker-cover.png',
    mobileRatio: 'max-[500px]:aspect-square',
    ratio: 'aspect-square',
  },
  {
    title: 'BIRDIE',
    additionalSlides: [
      {
        imageAlt: 'BIRDIE beauty salon services page',
        imageUrl: '/projects/birdie/services.jpg',
      },
      {
        imageAlt: 'BIRDIE beauty salon coloring service page',
        imageUrl: '/projects/birdie/coloring.jpg',
      },
      {
        imageAlt: 'BIRDIE beauty salon haircuts page',
        imageUrl: '/projects/birdie/haircuts.jpg',
      },
      {
        imageAlt: 'BIRDIE beauty salon service sets page',
        imageUrl: '/projects/birdie/sets.jpg',
      },
      {
        imageAlt: 'BIRDIE beauty salon about page',
        imageUrl: '/projects/birdie/about.jpg',
      },
      {
        imageAlt: 'BIRDIE beauty salon consultation page',
        imageUrl: '/projects/birdie/consultation.jpg',
      },
      {
        imageAlt: 'BIRDIE beauty salon gift certificates page',
        imageUrl: '/projects/birdie/certificates.jpg',
      },
      {
        imageAlt: 'BIRDIE beauty salon footer and contact page',
        imageUrl: '/projects/birdie/footer.jpg',
      },
    ],
    description:
      'Website for BIRDIE, a beauty salon with a strong brand image, service-focused structure, and clear digital entry point for clients.',
    href: '/projects/birdie',
    imageAlt: 'BIRDIE beauty salon website cover with dark textured background and large logo',
    imageUrl: '/projects/birdie/cover.jpg',
    mobileRatio: 'max-[500px]:aspect-[7/8]',
    ratio: 'aspect-[16/9]',
  },
];

const experienceItems: ExperienceItem[] = [
  {
    label: '42',
    period: '2024–2026',
  },
  {
    label: 'Yandex',
    period: '2022–2024',
  },
  {
    label: 'Freelance',
    period: '2021+',
  },
];

const serviceNames = [
  'Brand Strategy',
  'UX/UI Design',
  'Digital Design',
  'Visual Identity',
  'Editorial Design',
  'Editorial Design',
  'Web Development',
];

const renderDecoder = (text: string, isKeyboardFocusable = true) => (
  <DecoderText
    initialScrambleFrames={3}
    intervalMs={72}
    restoreScrambleFrames={2}
    tabIndex={isKeyboardFocusable ? undefined : -1}
  >
    {text}
  </DecoderText>
);

const getProjectId = (title: string) => {
  return `project-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
};

type ProjectDetailPageProps = {
  project: PortfolioProject;
};

const ProjectDetailPage = ({ project }: ProjectDetailPageProps) => {
  const projectSlides = project.additionalSlides ?? [];
  const shouldCropImageTop = project.title !== 'BIRDIE';

  return (
    <main className="h-screen w-screen overflow-x-hidden overflow-y-auto overscroll-y-contain bg-white px-[1.5em] py-[1em] text-black [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <a
        aria-label="Close project"
        className="fixed right-[1.5em] top-[1em] z-10 inline-block bg-transparent p-0 font-sans text-[2.2em] font-normal leading-none focus:outline-none focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-black"
        href={withBasePath('/')}
      >
        {renderDecoder('×', false)}
      </a>

      <h1 className="fixed left-[1.5em] top-[1em] z-10 font-sans text-[1em] font-normal uppercase leading-[1.3]">
        {project.title}
      </h1>

      <div className="mx-auto grid w-[82vw] max-w-[1080px] gap-[8vh] pb-[12vh] pt-[8vh] max-[700px]:w-[92vw] max-[700px]:gap-[6vh] max-[700px]:pb-[8vh] max-[700px]:pt-[7vh]">
        {projectSlides.map((slide, slideIndex) => (
          <figure
            className={shouldCropImageTop ? 'overflow-hidden' : ''}
            key={slide.imageUrl ?? `${project.title}-slide-${slideIndex}`}
          >
            {slide.imageUrl ? (
              <OptimizedImage
                alt={slide.imageAlt}
                className={`h-auto w-full object-contain ${shouldCropImageTop ? '-mt-[2px]' : ''}`}
                decoding="async"
                fetchPriority={slideIndex === 0 ? 'high' : 'auto'}
                loading={slideIndex === 0 ? 'eager' : 'lazy'}
                sizes="(max-width: 700px) 92vw, (min-width: 1318px) 1080px, 82vw"
                src={slide.imageUrl}
              />
            ) : null}
          </figure>
        ))}
      </div>
    </main>
  );
};

const PortfolioIndex = () => {
  const currentYear = new Date().getFullYear();

  return (
    <main className="h-screen w-screen overflow-hidden bg-white px-[1.5em] text-black max-[500px]:h-dvh">
      <div className="grid h-screen grid-cols-[4fr_3fr_2fr] gap-[1.5em] max-[1025px]:grid-cols-[1fr_290px] max-[500px]:h-dvh max-[500px]:grid-cols-[1fr_2fr]">
        <header className="sticky bottom-[1em] hidden min-w-[290px] self-end min-[1026px]:block">
          <h1 className="uppercase [text-indent:2em]">ALEKSANDR RYAZANTSEV</h1>
          <h2>Web Developer & Digital Designer</h2>
        </header>

        <section
          aria-labelledby="selected-projects"
          className="grid h-screen min-w-[350px] content-start gap-[1.95em] overflow-y-auto py-[1em] [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden max-[1025px]:min-w-0 max-[500px]:h-dvh max-[500px]:gap-[1.5em] max-[500px]:pb-[1em] max-[500px]:pt-[3em]"
          id="selected-works"
        >
          <div className="uppercase [text-indent:2em] max-[500px]:hidden" id="selected-projects">
            Selected Projects
          </div>

          {portfolioProjects.map((project) => {
            const projectId = getProjectId(project.title);
            const hasProjectMeta = Boolean(project.description || project.year);
            const projectHref = withBasePath(project.href ?? '#');
            const isPriorityProjectImage = project.title === 'TOTO';

            return (
              <article
                aria-label={hasProjectMeta ? undefined : project.title}
                aria-labelledby={hasProjectMeta ? projectId : undefined}
                key={project.title}
              >
                <figure className="grid gap-x-[1.3em] gap-y-[1.5em] px-[2em] leading-none max-[500px]:px-0">
                  <a
                    aria-label={`Open ${project.title} project`}
                    className="group block focus:outline-none focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-black"
                    href={projectHref}
                  >
                    {project.imageUrl ? (
                      <OptimizedImage
                        alt={project.imageAlt ?? project.title}
                        className={`${project.ratio ?? 'aspect-[4/5]'} ${project.mobileRatio ?? ''} w-full ${project.imageClassName ?? 'object-cover'} transition-[filter] duration-300 min-[501px]:group-hover:grayscale max-[500px]:transition-none`}
                        decoding="async"
                        fetchPriority={isPriorityProjectImage ? 'high' : 'auto'}
                        loading="eager"
                        sizes="(min-width: 1026px) 32vw, (min-width: 501px) calc(100vw - 320px), 31vw"
                        src={project.imageUrl}
                      />
                    ) : (
                      <div
                        aria-label={`${project.title} cover`}
                        className={`${project.ratio ?? 'aspect-[4/5]'} ${project.mobileRatio ?? ''} grid w-full place-items-center bg-[#F6F6F6] font-sans text-[clamp(28px,4vw,72px)] font-normal leading-none tracking-normal`}
                        role="img"
                      >
                        {project.coverLabel ?? project.title}
                      </div>
                    )}
                  </a>
                </figure>

                {hasProjectMeta ? (
                  <div className="mt-[0.65em] max-[500px]:hidden">
                    <div className="grid grid-cols-[3fr_1fr]">
                      <h2 className="uppercase [text-indent:2em]" id={projectId}>
                        <a href={projectHref}>
                          {renderDecoder(project.title, false)}
                        </a>
                      </h2>
                      {project.year ? (
                        <span aria-label={`Year ${project.year}`}>{project.year}</span>
                      ) : null}
                    </div>
                    {project.description ? (
                      <p>
                        {project.description}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </article>
            );
          })}
        </section>

        <aside className="sticky top-0 flex h-screen min-w-[290px] flex-wrap content-between gap-y-[3.25em] overflow-hidden py-[1em] max-[1025px]:min-w-0 max-[500px]:h-dvh max-[500px]:pb-[2.5em]">
          <div className="grid auto-rows-min gap-[1.3em]">
            <div id="about">
              <div className="uppercase [text-indent:2em]">About</div>
              <div>
                <span>Aleksandr Ryazantsev is a d</span>
                igital product designer who creates interfaces and writes code,
                from first idea to launch. Feel free to{' '}
                <a className="inline-block" href="mailto:raa050505@gmail.com">
                  {renderDecoder('contact', false)}
                </a>{' '}
                for project inquiries.
              </div>
            </div>

            <div id="experience">
              <div className="uppercase [text-indent:2em]">Experience</div>
              <div className="grid grid-cols-2 gap-x-[1.5em]">
                {experienceItems.map((experienceItem) => (
                  <Fragment key={experienceItem.label}>
                    <span>
                      {experienceItem.label}
                    </span>
                    <span>
                      {experienceItem.period}
                    </span>
                  </Fragment>
                ))}
              </div>
            </div>

            <section className="grid grid-cols-2 gap-[1.5em] max-[500px]:gap-x-[1em]">
              <div id="services">
                <div className="uppercase [text-indent:2em]">Services</div>
                <div className="grid content-start">
                  {serviceNames.map((serviceName, serviceIndex) => (
                    <span key={`${serviceName}-${serviceIndex}`}>
                      {serviceName}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid auto-rows-min gap-[1.3em]">
                <div id="contact">
                  <div className="uppercase [text-indent:2em]">Contact</div>
                  <div className="grid content-start">
                    <a className="w-fit" href="mailto:raa050505@gmail.com">
                      {renderDecoder('Email', false)}
                    </a>
                    <a
                      className="w-fit"
                      href="https://t.me/RAAWSD"
                      rel="noreferrer"
                      target="_blank"
                    >
                      {renderDecoder('Telegram', false)}
                    </a>
                    <a
                      className="w-fit"
                      href={withBasePath('/Alexander_Ryazantsev_CV_RU.pdf')}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {renderDecoder('RESUME (CV)', false)}
                    </a>
                  </div>
                </div>

              </div>
            </section>

          </div>

          <p aria-label={`Copyright ${currentYear}`} className="w-full">
            All rights reserved.
            <br />© Aleksandr Ryazantsev, {currentYear}
          </p>
        </aside>
      </div>
    </main>
  );
};

export const PortfolioHome = () => {
  const currentPath = getRoutePath(window.location.pathname);
  const selectedProject = portfolioProjects.find(
    (project) => project.href === currentPath,
  );

  if (selectedProject) {
    return <ProjectDetailPage project={selectedProject} />;
  }

  return <PortfolioIndex />;
};
