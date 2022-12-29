class Comment < ApplicationRecord
  include Visible

  belongs_to :article # specifies that each comment model belongs to one article
end
