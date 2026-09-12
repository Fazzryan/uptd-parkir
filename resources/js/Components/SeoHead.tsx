import { Head } from "@inertiajs/react";
import React from "react";

interface SeoHeadProps {
    title?: string;
    description?: string;
    keywords?: string;
    canonicalUrl?: string;
    ogImage?: string;
    ogType?: "website" | "article";
    schemaJsonLd?: Record<string, any> | Record<string, any>[];
}

export default function SeoHead({
    title,
    description = "Situs Resmi UPTD Pengelola Parkir Dinas Perhubungan Kabupaten Tasikmalaya - Informasi Tarif Parkir, Wilayah Parkir Resmi, Panduan Juru Parkir, dan Berita Terkini.",
    keywords = "UPTD Parkir, Parkir Tasikmalaya, Tarif Parkir Tasikmalaya, Juru Parkir Tasikmalaya, Wilayah Parkir Tasikmalaya, Retribusi Parkir",
    canonicalUrl,
    ogImage = "/assets/logo/logotasik.png",
    ogType = "website",
    schemaJsonLd,
}: SeoHeadProps) {
    const defaultTitle = "UPTD Pengelola Parkir Kab. Tasikmalaya";
    const fullTitle = title ? title : defaultTitle;

    return (
        <Head title={fullTitle}>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="robots" content="index, follow" />
            <meta name="googlebot" content="index, follow" />

            {/* OpenGraph Meta Tags */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content={ogType} />
            {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
            {ogImage && <meta property="og:image" content={ogImage} />}

            {/* Twitter Cards */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            {ogImage && <meta name="twitter:image" content={ogImage} />}

            {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

            {schemaJsonLd && (
                <script type="application/ld+json">
                    {JSON.stringify(schemaJsonLd)}
                </script>
            )}
        </Head>
    );
}
