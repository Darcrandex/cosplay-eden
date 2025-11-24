# cosplay-eden

## drizzle 数据库

1. 配置 drizzle.config.ts
2. 运行 `npx drizzle-kit generate` 生成迁移文件
3. 运行 `npx drizzle-kit migrate` 迁移数据库

## vercel 定时任务

- [vercel 定时任务文档](https://vercel.com/docs/cron-jobs)

## bugs

`drizzle-orm`新版本存在问题, 在使用会提示类型错误, 建议使用`0.44.6`版本
