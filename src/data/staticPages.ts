export interface StaticPage {
  slug: string;
  title: string;
  description: string;
  sections: Array<{
    heading: string;
    body: string;
  }>;
}

export const staticPages: StaticPage[] = [
  {
    slug: 'sales-page',
    title: 'Sales Page',
    description: 'A flexible content page route for Shoppego menu links while CMS page content is not available in the Headless API.',
    sections: [
      {
        heading: 'Live storefront data',
        body: 'Products, categories, menus, cart, and checkout are powered by the Shoppego Headless Storefront API.'
      },
      {
        heading: 'Content source',
        body: 'The current documented API does not expose CMS page body content, so this Astro route provides a styled fallback page that can be replaced when a page endpoint becomes available.'
      }
    ]
  },
  {
    slug: 'shipping-policy',
    title: 'Shipping Policy',
    description: 'Shipping options and fees are confirmed during the secure Shoppego checkout.',
    sections: [
      {
        heading: 'Shipping calculation',
        body: 'The storefront creates checkout from selected variant IDs and quantities. Shoppego calculates available shipping methods in hosted checkout.'
      }
    ]
  },
  {
    slug: 'return-policy',
    title: 'Return Policy',
    description: 'Return eligibility depends on the final order, item condition, and store policy.',
    sections: [
      {
        heading: 'Order support',
        body: 'Use your order confirmation details when contacting the store about returns or exchanges.'
      }
    ]
  },
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    description: 'Customer checkout and payment details are handled by the secure Shoppego hosted checkout.',
    sections: [
      {
        heading: 'Checkout privacy',
        body: 'This storefront sends cart line items to Shoppego checkout. Payment and order information is collected in the hosted checkout flow.'
      }
    ]
  },
  {
    slug: 'terms-of-service',
    title: 'Terms of Service',
    description: 'Store terms apply to purchases completed through the hosted checkout.',
    sections: [
      {
        heading: 'Purchases',
        body: 'Final prices, taxes, shipping, discounts, and payment confirmation are presented during checkout.'
      }
    ]
  }
];

export function getStaticPage(slug: string): StaticPage | null {
  return staticPages.find((page) => page.slug === slug) || null;
}
