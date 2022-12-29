module Visible # reusable code which can be included in multiple controllers
  extend ActiveSupport::Concern # pulls in active support api to allow included and class_methods

  VALID_STATUSES = %w[public private archived]

  included do # adds to each model which includes this concern
    validates :status, inclusion: { in: VALID_STATUSES }
  end

  class_methods do
    def public_count
      where(status: 'public').count
    end
  end

  def archived? # returns true or false depending on the status
    status == 'archived'
  end
end
