class CreateArticles < ActiveRecord::Migration[7.0]
  def change
    create_table :articles do |t| # create_table automatically adds an id column as an auto-incrementing primary key
      t.string :title             # string can hold up to 255 characters
      t.text :body                # text can hold up to 30,000 characters

      t.timestamps                # automatically managed by rails, generates a created_at and updated_at timestamp
    end
  end
end
