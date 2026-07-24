import { Head } from "@inertiajs/react";
import React from "react";

interface SeoHeadProps {
    title?: string;
    description?: string;
    keywords?: string;
    canonicalUrl?: string;
    schemaJsonLd?: Record<string, any> | Record<string, any>[];
}

export default function SeoHead({
    title,
    description = "Situs Resmi UPTD Pengelola Parkir Dinas Perhubungan Kabupaten Tasikmalaya - Informasi Tarif Parkir, Wilayah Parkir Resmi, Panduan Juru Parkir, dan Berita Terkini.",
    keywords = "UPTD Parkir, Parkir Tasikmalaya, Tarif Parkir Tasikmalaya, Juru Parkir Tasikmalaya, Wilayah Parkir Tasikmalaya, Retribusi Parkir",
    canonicalUrl,
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

            {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

            {schemaJsonLd && (
                <script type="application/ld+json">
                    {JSON.stringify(schemaJsonLd)}
                </script>
            )}
        </Head>
    );
}
