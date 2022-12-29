class Article < ApplicationRecord
  include Visible

  has_many :comments, dependent: :destroy # specifies that each article can have many comments and destroys them if deleted

  validates :title, presence: true                         # presence true must contain at least one non-whitespace character
  validates :body, presence: true, length: { minimum: 10 } # set specifications on string length requirements
end

