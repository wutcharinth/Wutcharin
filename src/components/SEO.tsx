import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: string;
}

export default function SEO({
    title,
    description,
    keywords = "Wutcharin Thatan, Data Strategy, AI Engineer, Portfolio, Full Stack Developer, Thailand",
    image = "https://wutcharin.com/portrait.jpg",
    url,
    type = "website"
}: SEOProps) {
    const pageUrl = url ?? (typeof window !== 'undefined' ? `https://wutcharin.com${window.location.pathname}` : 'https://wutcharin.com/');
    const siteTitle = `${title} | Wutcharin Thatan`;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{siteTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <link rel="canonical" href={pageUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={pageUrl} />
            <meta property="og:title" content={siteTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={pageUrl} />
            <meta property="twitter:title" content={siteTitle} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />

            {/* AI & Bot Optimization */}
            <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        </Helmet>
    );
}
