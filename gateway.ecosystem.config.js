module.exports = {
  apps: [
    {
      name: 'gateway',
      script: 'npm run build:gateway && npm run run:gateway',
      error_file: './.pm2/err.log',
      out_file: './.pm2/out.log',
      args: 'one two',
      instances: 1, //'max'
      instance_var: 'INSTANCE_ID',
      exec_mode: 'fork',
      wait_ready: true,
      max_restarts: 5,
      autorestart: true,
      restart_delay: 5,
      watch: false,
      ignore_watch: ['./views', '/views', 'views'],
      vizion: true,
      max_memory_restart: '500M',
      env: {
        NODE_OPTIONS: '--max-old-space-size=1024',
      },
      env_dev: {
        NODE_ENV: 'dev',
        DEBUG: 'false',
        NODE_OPTIONS: '--max-old-space-size=1024',
      },
      env_test: {
        NODE_ENV: 'test',
        DEBUG: 'false',
        NODE_OPTIONS: '--max-old-space-size=1024',
      },
      env_prod: {
        NODE_ENV: 'prod',
        DEBUG: 'false',
        NODE_OPTIONS: '--max-old-space-size=1024',
      },
    }
  ],
};
