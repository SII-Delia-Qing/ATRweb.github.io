import { type SchemaTypeDefinition } from 'sanity'

const teamMember: SchemaTypeDefinition = {
  name: 'teamMember',
  title: 'Team Member (团队成员)',
  type: 'document',
  fields: [
    {
      name: 'nameZh',
      title: 'Chinese Name (姓名)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'nameEn',
      title: 'English Name (Name)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'category',
      title: 'Category (类别)',
      type: 'string',
      options: {
        list: [
          { title: '课题组PI', value: 'pi' },
          { title: '博士研究生', value: 'phd' },
          { title: '硕士研究生', value: 'master' },
          { title: '访问学生', value: 'visiting_student' },
          { title: '博士后', value: 'postdoc' },
          { title: '毕业生', value: 'alumni' },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'image',
      title: 'Photo (照片)',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'email',
      title: 'Email (邮箱)',
      type: 'string',
    },
    {
      name: 'researchInterests',
      title: 'Research Interests (研究方向)',
      type: 'string',
    },
    {
      name: 'affiliation',
      title: 'Affiliation (单位)',
      type: 'string',
    },
    {
      name: 'bio',
      title: 'Bio (个人简介)',
      type: 'text',
      description: 'Limited to 80 characters',
      validation: (Rule) => Rule.max(80),
    },
    {
      name: 'websiteUrl',
      title: 'Website URL (个人主页/Scholar)',
      type: 'url',
    },
    {
      name: 'hasDetailPage',
      title: 'Create Internal Detail Page? (是否创建站内个人主页)',
      type: 'boolean',
      initialValue: false,
      hidden: ({ document }) => !!document?.websiteUrl,
    },
    {
      name: 'content',
      title: 'Personal Page Content (个人主页详细内容)',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
        },
      ],
      hidden: ({ document }) => !!document?.websiteUrl || !document?.hasDetailPage,
    },
    {
      name: 'order',
      title: 'Display Order (排序权重)',
      type: 'number',
      description: 'Smaller numbers appear first',
    },
  ],
}

const publication: SchemaTypeDefinition = {
  name: 'publication',
  title: 'Publication (论文)',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title (论文标题)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'authors',
      title: 'Authors (作者)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'venue',
      title: 'Journal/Conference (发表的期刊或会议)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'year',
      title: 'Year (发表年份)',
      type: 'number',
      validation: (Rule) => Rule.required().min(1900).max(2100),
    },
    {
      name: 'image',
      title: 'Cover Image (封面图)',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'paperUrl',
      title: 'Paper URL (论文链接)',
      type: 'url',
    },
  ],
}

const newsItem: SchemaTypeDefinition = {
  name: 'newsItem',
  title: 'News Item (新闻)',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title (新闻标题)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'date',
      title: 'Date (新闻日期)',
      type: 'date',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'category',
      title: 'Category (新闻类别)',
      type: 'string',
      options: {
        list: [
          { title: 'PUBLICATION', value: 'PUBLICATION' },
          { title: 'TEAM', value: 'TEAM' },
          { title: 'AWARD', value: 'AWARD' },
          { title: 'EVENT', value: 'EVENT' },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'summary',
      title: 'Summary (新闻概述)',
      type: 'text',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'hasDetail',
      title: 'Has Detail Page? (是否创建详情页)',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'content',
      title: 'Content (详情内容)',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
        },
      ],
      hidden: ({ document }) => !document?.hasDetail,
    },
  ],
}

const galleryItem: SchemaTypeDefinition = {
  name: 'galleryItem',
  title: 'Gallery Item (相册)',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Admin Title (管理标题 - 仅供后台识别)',
      type: 'string',
    },
    {
      name: 'image',
      title: 'Image (照片)',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'caption',
      title: 'Caption (说明文字 - 可选)',
      type: 'string',
    },
    {
      name: 'date',
      title: 'Date (日期 - 可选)',
      type: 'date',
    },
    {
      name: 'order',
      title: 'Display Order (排序权重)',
      type: 'number',
      description: '数字越小越靠前',
    },
  ],
}

const spinOff: SchemaTypeDefinition = {
  name: 'spinOff',
  title: 'Spin-off Company (公司)',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Company Name (公司名称)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'logo',
      title: 'Company Logo (公司Logo)',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description (公司简介)',
      type: 'text',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'websiteUrl',
      title: 'Website URL (公司官网)',
      type: 'url',
    },
    {
      name: 'order',
      title: 'Display Order (排序权重)',
      type: 'number',
      description: 'Smaller numbers appear first',
    },
  ],
}

const researchArea: SchemaTypeDefinition = {
  name: 'researchArea',
  title: 'Research Area (研究方向)',
  type: 'document',
  fields: [
    {
      name: 'titleZh',
      title: 'Chinese Title (中文标题)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'titleEn',
      title: 'English Title (英文标题)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'icon',
      title: 'Icon (图标)',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description (方向介绍)',
      type: 'text',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'order',
      title: 'Display Order (排序权重)',
      type: 'number',
      description: 'Smaller numbers appear first',
    },
  ],
}

const researchPage: SchemaTypeDefinition = {
  name: 'researchPage',
  title: 'Research Page Settings (研究页面设置)',
  type: 'document',
  fields: [
    {
      name: 'introduction',
      title: 'Introduction Text (页面顶部介绍)',
      type: 'text',
      validation: (Rule) => Rule.required(),
    },
  ],
}

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [teamMember, publication, newsItem, galleryItem, spinOff, researchArea, researchPage],
}