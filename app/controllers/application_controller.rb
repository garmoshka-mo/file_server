class ApplicationController < ActionController::Base

  skip_before_action :verify_authenticity_token

  def upload
    metadata = request.headers['Metadata']
    puts "Processing request: #{metadata}"
    metadata = JSON.parse metadata

    filename = metadata['ccmImageName'] || "#{Time.now.to_i}.mp4"
    File.open("public/uploads/#{filename}", 'wb') do |f|
      f.write  request.body.read
    end
    puts "File saved: #{filename}"

    render json: {success: false, filename: "uploads/#{filename}"}
  rescue => e
    render json: {success: false, message: e.to_s}
  end

end
