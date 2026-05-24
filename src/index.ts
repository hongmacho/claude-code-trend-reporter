#!/usr/bin/env node

import { Command } from 'commander';
import ora from 'ora';
import { fetchAllTrends } from './research/github.js';
import { aggregateResults } from './research/aggregator.js';
import { writeReport } from './report/generator.js';

const program = new Command();

program
  .name('claudescope')
  .description('Claude Code 생태계의 최신 스킬·플러그인·MCP 서버 트렌드를 자동 리서치하고 HTML 리포트로 제공하는 CLI 도구')
  .version('1.0.0');

program
  .command('research')
  .description('Claude Code 생태계 트렌드를 조사하고 HTML 리포트를 생성합니다')
  .option('-o, --output <dir>', '리포트 출력 디렉토리', '.')
  .option('--no-open', '브라우저 자동 실행 비활성화')
  .action(async (options: { output: string; open: boolean }) => {
    const spinner = ora('GitHub에서 Claude Code 생태계 트렌드를 조사 중...').start();

    try {
      spinner.text = 'GitHub API에서 저장소 정보를 수집 중...';
      const { results: repoMap, success } = await fetchAllTrends();

      spinner.text = '데이터를 집계하고 카테고리별로 분류 중...';
      const result = aggregateResults(repoMap, !success);

      if (result.isMockData) {
        spinner.warn('GitHub API에 연결할 수 없어 내장 Mock 데이터를 사용합니다.');
      } else {
        const totalItems = result.skills.length + result.mcpServers.length + result.plugins.length + result.settings.length;
        spinner.text = `${totalItems}개 항목을 수집했습니다. HTML 리포트 생성 중...`;
      }

      const reportPath = await writeReport(result, options.output, options.open);

      spinner.succeed(`리포트가 생성되었습니다: ${reportPath}`);

      if (options.open) {
        console.log('\n브라우저에서 리포트를 열고 있습니다...');
      }
    } catch (error) {
      spinner.fail('리포트 생성 중 오류가 발생했습니다.');
      if (error instanceof Error) {
        console.error(`오류: ${error.message}`);
      } else {
        console.error('알 수 없는 오류가 발생했습니다.');
      }
      process.exit(1);
    }
  });

program.parse();
