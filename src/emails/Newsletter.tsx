import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
  Button,
  Row,
  Column
} from '@react-email/components';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface NewsletterProps {
  content: string;
  subject?: string;
  issueNumber?: string;
}

export const Newsletter = ({
  content = "Hallo!\n\nDas ist ein Test-Newsletter.",
  subject = "Neues von der DPSG Eschborn",
  issueNumber = "01"
}: NewsletterProps) => {
  return (
    <Tailwind>
      <Html>
        <Head />
        <Preview>{subject}</Preview>
        <Body className="bg-[#F4DAB3] m-auto font-sans px-2 py-10 w-full mb-10 h-full">
          <Container className="border border-solid border-[#d9ceb6] rounded-xl my-[10px] mx-auto max-w-[600px] bg-[white] shadow-md overflow-hidden p-0">
            {/* DPSG Banner / Logo Placeholder (Flush with top) */}
            <Section className="bg-[#001a33] p-6 py-8 mb-0 w-full">
              <Row>
                <Column align="left" className="w-[50%]">
                  <Img 
                    src={`http://localhost:3000/logo.png`} 
                    width="120" 
                    alt="DPSG Eschborn" 
                    className="block m-0"
                  />
                </Column>
                <Column align="right" className="w-[50%]">
                  <Text className="text-white text-[22px] font-bold uppercase tracking-wider m-0 text-right">
                    Newsletter <span className="text-white">#{issueNumber}</span>
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Content Section with Padding */}
            <Section className="px-[30px] pt-[20px] pb-[32px]">
              {/* Markdown Content rendered via custom mapped components */}
              <Markdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({node, ...props}) => <Heading as="h1" className="text-[#001a33] text-[26px] font-bold uppercase tracking-wider p-0 mt-[10px] mb-[24px]" {...props} />,
                  h2: ({node, ...props}) => <Heading as="h2" className="text-black text-[22px] font-normal p-0 mt-[10px] mb-[20px]" {...props} />,
                  h3: ({node, ...props}) => <Heading as="h3" className="text-[#001a33] text-[18px] font-bold mb-4 mt-8" {...props} />,
                  h4: ({node, ...props}) => <Heading as="h4" className="text-black text-[16px] font-semibold mb-3 mt-6" {...props} />,
                  p: ({node, ...props}) => <Text className="text-[#404040] text-[15px] leading-[24px] mb-4" {...props} />,
                  a: ({node, title, href, children, ...props}) => {
                    // Custom Button Syntax via title
                    if (title === "button") {
                      return (
                        <Section className="text-center mt-[32px] mb-[32px]">
                          <Button
                            className="bg-[#001a33] rounded text-white text-[14px] font-semibold no-underline text-center px-6 py-3 block"
                            href={href}
                          >
                            {children}
                          </Button>
                        </Section>
                      );
                    }
                    return <Link className="text-[#E3B227] no-underline hover:underline" href={href} {...props}>{children}</Link>;
                  },
                  ul: ({node, ...props}) => <ul className="text-[#404040] text-[15px] leading-[24px] pl-6 mb-4" {...props} />,
                  ol: ({node, ...props}) => <ol className="text-[#404040] text-[15px] leading-[24px] pl-6 mb-4" {...props} />,
                  li: ({node, ...props}) => <li className="mb-1" {...props} />,
                  img: ({node, src, alt, ...props}) => (
                    <Img
                      src={src}
                      alt={alt}
                      width="100%"
                      className="my-6 rounded block"
                    />
                  ),
                  blockquote: ({node, ...props}) => (
                    <blockquote className="border-l-4 border-[#003A79] pl-4 text-gray-500 italic my-4" {...props} />
                  )
                }}
              >
                {content}
              </Markdown>
            </Section>


            <Section className="px-[30px] pb-[30px]">
              <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
              
              <Text className="text-[#666666] text-[12px] leading-[24px] text-center">
                Dieser Newsletter wurde von der DPSG Eschborn gesendet. <br />
                Stammesführung DPSG Eschborn &bull; <Link href="https://dpsg-eschborn.de" className="text-[#001a33] underline">
                  dpsg-eschborn.de
                </Link><br />
                <Link href="https://dpsg-eschborn.de/unsubscribe" className="text-[#999999] underline mt-2 inline-block">
                  Newsletter abbestellen
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};

export default Newsletter;
