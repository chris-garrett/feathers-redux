PROJECT_NAME="feathers-redux"

desc "up"
task :up do
  sh("docker-compose -p #{PROJECT_NAME} up -d")
end

desc "down"
task :down do
  sh("docker-compose -p #{PROJECT_NAME} stop")
  sh("docker-compose -p #{PROJECT_NAME} rm -f")
end

desc "restart everything"
task :restart => [:down, :up]

desc "logs"
task :log do
  sh("docker-compose -p #{PROJECT_NAME} logs -f")
end
task :logs => :log

desc "bash into app"
task :bash do
  sh("docker exec -it feathersredux_app_1 bash")
end

task :default do
  sh('rake -T')
end
