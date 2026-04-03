import { Document } from '@sitecore-content-sdk/content/types/atoms';

export const productPuicker: Document = {
  name: 'ProductPickerPreset',
  root: {
    id: 'ae262910-c132-431f-a488-d18af9c39e43',
    type: 'Stack',
    version: 2,
    children: [
      {
        id: 'eead1514-d55c-4113-8d73-f6e51cce1c01',
        type: 'Select',
        bindings: {
          value: {
            bindType: 'expression',
            value: '{{state.category}}',
          },
          onValueChange: {
            bindType: 'event',
            arguments: ['value', 'label'],
            actions: [
              {
                setState: {
                  category: '{{value}}',
                },
              },
              {
                call: 'trackSelection',
                args: ['{{value}}', '{{label}}'],
              },
            ],
          },
        },
        children: [
          {
            id: 'e0abec67-6c9e-442a-81e5-acc86b4eaffb',
            type: 'SelectTrigger',
            children: [
              {
                id: '80f907ac-ff71-409d-b39a-327e7833814c',
                type: 'SelectValue',
                staticProps: {
                  placeholder: 'Select a category',
                },
              },
            ],
          },
          {
            id: '8b11ed97-2af1-4bdf-aaa9-cd3dadc4cd4a',
            type: 'SelectContent',
            children: [
              {
                id: '168db3c5-ce62-4bcc-8044-3c199fd761a3',
                type: 'SelectItem',
                show: {
                  and: [
                    {
                      left: '{{props.categories.length}}',
                      op: 'eq',
                      right: '{{state.selectedCategories.count}}',
                    },
                    {
                      left: '{{item.value}}',
                      op: 'eq',
                      right: '{{state.selectedCategory}}',
                    },
                  ],
                },
                for: {
                  each: '{{props.categories}}',
                  as: 'item',
                  key: '{{item.value}}',
                },
                staticProps: {
                  classname: 'color-balck',
                },
                bindings: {
                  value: {
                    bindType: 'expression',
                    value: '{{item.value}}',
                  },
                },
                children: ['{{item.label}}'],
              },
            ],
          },
        ],
      },
      {
        id: '966bf556-04ff-4112-a8ae-00a071606cd4',
        type: 'Image',
        staticProps: {
          alt: 'alt',
          width: 300,
        },
        bindings: {
          src: {
            bindType: 'expression',
            value: '{{props.imagesByCategory[state.category]}}',
          },
          onValueChange: {
            bindType: 'event',
            arguments: ['event', 'foo'],
            actions: [
              {
                setState: {
                  category: '{{event.target.value}}',
                },
              },
              {
                call: 'analyticsTrack',
                args: [
                  '{{event.target.value}}',
                  'category-selected',
                  '{{props.imagesByCategory[state.category]}}',
                ],
              },
            ],
          },
        },
      },
    ],
  },
  props: {
    categories: [
      {
        value: 'hats',
        label: 'Hats',
      },
      {
        value: 'shoes',
        label: 'Shoes',
      },
      {
        value: 'bags',
        label: 'Bags',
      },
    ],
    imagesByCategory: {
      hats: '/images/hats.png',
      shoes: '/images/shoes.png',
      bags: '/images/bags.png',
    },
  },
  state: {},
};

export const cardsWithDataBinding: Document = {
  name: 'CardsPresetWithDataBinding',
  root: {
    id: '5112db36-b362-4be5-8b78-5f2f21ad6c77',
    type: 'Stack',
    staticProps: {
      gap: 3,
    },
    children: [
      {
        id: 'd10f1255-412e-4b40-9e8e-0b0643b439d4',
        type: 'Card',
        for: {
          each: '{{props.Teaser}}',
          as: 'item',
        },
        children: [
          {
            id: '7237936e-9cf0-43b7-9445-b10f3b32b94c',
            type: 'CardHeader',
            children: [
              {
                id: '15ff0525-c3d6-4d24-994b-78c11ef19a15',
                type: 'CardTitle',
                children: ['{{item.title}}'],
              },
              {
                id: '442df2cc-3aa9-4a0d-9221-f70dbf045ac6',
                type: 'CardDescription',
                children: ['{{item.description}}'],
              },
            ],
          },
          {
            id: 'bfb8aa23-b397-48ea-930f-190488963b77',
            type: 'CardContent',
            children: [
              {
                id: 'aad40af8-14f6-4752-8310-6eb4bc52b619',
                type: 'Image',
                staticProps: {
                  width: 300,
                  height: 200,
                },
                bindings: {
                  src: {
                    bindType: 'expression',
                    value: '{{item.image}}',
                  },
                  alt: {
                    bindType: 'expression',
                    value: '{{item.title}}',
                  },
                },
              },
            ],
          },
        ],
      },
    ],
  },
  props: {
    Link_list_intro: {
      Title: 'Learn more about SaaS content management',
    },
    Teaser: [
      {
        badge: 'Article',
        button_label: 'Read the article',
        button_URL:
          'https://www.sitecore.com/blog/cloud/what-is-cloud-native-saas?utm_websource=products.xm-cloud',
        description:
          'Grasping the benefits and differences between SaaS, cloud-computing, cloud-native, and cloud-hosted is important in determining which technology has the scalability you need — and should expect — to support your long-term growth.',
        image:
          'https://sitecorecontenthub.stylelabs.cloud/api/public/content/b4ee038a89874af1838812bfd47c3c7c?v=67c7884d',
        title: 'SaaS, cloud computing, and cloud-native development — unravel the difference',
      },
      {
        badge: 'Article',
        button_label: 'Read the article',
        button_URL:
          'https://www.sitecore.com/knowledge-center/digital-marketing-resources/why-saas?utm_websource=products.xm-cloud',
        description:
          'Investing in a SaaS platform can provide benefits for your business, your internal teams, and your customers. Whatever your unique needs, we can empower you to create the experiences that drive competitive advantage and deliver value.',
        image:
          'https://sitecorecontenthub.stylelabs.cloud/api/public/content/e253b03b15dd4cd49f84acefcdeef95a?v=3d1436cd',
        title: "What's the big deal with a SaaS CMS?",
      },
      {
        badge: 'Article',
        button_label: 'Read the article',
        button_URL:
          'https://www.sitecore.com/knowledge-center/digital-marketing-resources/what-is-cloud-content-management?utm_websource=products.xm-cloud',
        description:
          "Explore cloud-based content management — including its definition, history, benefits, and how to determine when it's right for your organization.",
        image:
          'https://sitecorecontenthub.stylelabs.cloud/api/public/content/3a4e4216497c4edb833954241d10bf01?v=93a3d391',
        title: 'Why is everyone moving their content to the cloud?',
      },
    ],
  },
};

export const accordionWithCards: Document = {
  name: 'AccordionPreset',
  root: {
    id: '87a7cbaa-76fb-4086-bbe7-b8f43ea35eb8',
    type: 'Accordion',
    staticProps: {
      type: 'single',
      collapsible: true,
    },
    children: [
      {
        id: 'b1df2e76-c2b5-4420-8ee3-d60127ba3553',
        type: 'AccordionItem',
        staticProps: {
          value: 'item-1',
        },
        children: [
          {
            id: 'a13e9646-f8f2-4519-a92a-9bf15cbd933c',
            type: 'AccordionTrigger',
            children: ['Section One'],
          },
          {
            id: '0122d596-9b63-4ac7-9a3b-be0401962b9e',
            type: 'AccordionContent',
            children: [
              {
                id: '053ca280-5df8-4a77-823b-c10774b56b77',
                type: 'Card',
                children: [
                  {
                    id: 'f2396b45-1620-4136-9bed-11e9566c8407',
                    type: 'CardHeader',
                    children: [
                      {
                        id: '33e3041d-7d75-4e04-a2f0-571020be9791',
                        type: 'CardTitle',
                        children: ['First'],
                      },
                    ],
                  },
                  {
                    id: 'bb33fdb9-c9ad-444f-bd25-0314c1b0202c',
                    type: 'CardContent',
                    children: [
                      {
                        id: 'b5e32073-e254-4904-82fd-07718c5761b0',
                        type: 'Button',
                        children: ['Click'],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: '0444d9e6-fee6-4b5f-862e-2b9488a2fdee',
        type: 'AccordionItem',
        staticProps: {
          value: 'item-2',
        },
        children: [
          {
            id: '63479846-0e0e-430a-94d3-fb88c07cc13c',
            type: 'AccordionTrigger',
            children: ['Section Two'],
          },
          {
            id: 'a3a1a342-a913-45af-866f-3958df717ec8',
            type: 'AccordionContent',
            children: [
              {
                id: 'ce73c89a-e9df-4295-b7d5-ee58f3f8b938',
                type: 'Card',
                children: [
                  {
                    id: 'a43af69f-57bd-4916-bcf4-49b1092a315c',
                    type: 'CardHeader',
                    children: [
                      {
                        id: 'c3283b16-9c95-4820-aec8-ed481cff6a58',
                        type: 'CardTitle',
                        children: ['Second'],
                      },
                    ],
                  },
                  {
                    id: 'b6b20825-464b-423f-8062-45379c687ba8',
                    type: 'CardContent',
                    children: [
                      {
                        id: '5f70bed9-91e9-44d6-bba3-63974f95bb8a',
                        type: 'Button',
                        children: ['Open'],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};

export const cardPreset: Document = {
  name: 'CardPreset',
  root: {
    id: '60ed1306-fda6-4e6b-974d-55746f516e37',
    type: 'Card',
    children: [
      {
        id: 'f3b22759-8dd0-4d2c-a295-5ce5069ee771',
        type: 'CardHeader',
        children: [
          {
            id: '5563c8c8-c88f-4357-a0b3-0520a3dcce37',
            type: 'CardTitle',
            children: ['Profile'],
          },
          {
            id: 'e51bcfe3-04d1-4ccd-98e7-cd56d97de021',
            type: 'CardDescription',
            children: ['Manage your profile settings'],
          },
        ],
      },
      {
        id: 'a2437056-2155-4a38-8479-d6aaeb05e33f',
        type: 'CardContent',
        children: [
          {
            id: 'e4d5dba0-2b67-4093-914b-ce83ec7e2c64',
            type: 'Input',
            staticProps: {
              placeholder: 'Your name',
            },
          },
          {
            id: '3111c1c6-c6eb-422a-8665-077247204a11',
            type: 'Button',
            children: ['Save'],
          },
        ],
      },
      {
        id: '63accf88-805f-42df-a17a-83f0b4a052aa',
        type: 'CardFooter',
        children: [
          {
            id: 'b3928606-1e64-44b8-ab66-b69f28354787',
            type: 'Button',
            staticProps: {
              variant: 'outline',
            },
            children: ['Cancel'],
          },
        ],
      },
    ],
  },
  state: {
    name: '',
  },
};
