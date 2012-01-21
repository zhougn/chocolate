task :build do
  FileUtils.mkdir_p 'build'
  %x[juicer merge -sf src/*.js -o build/chocolate.min.js]
end
