Rails.application.routes.draw do
  root to: "articles#index" # articles controller, index action (method)

  resources :articles do # automatically maps all RESTful routes and methods, and sets up helper methods
    resources :comments # nested resource within articles
  end

  ### "RESTful Routes" ###
  get "/posts", to: "posts#index"          # GET all posts
  post "/posts", to: "posts#create"        # POST data you filled in to create new post
  get "/posts/new", to: "posts#new"        # GET page to create new post
  get "/posts/:id/edit", to: "posts#edit"  # GET page to edit existing post
  get "/posts/:id", to: "posts#show"       # GET one specific post
  put "/posts/:id", to: "posts#update"     # PUT data you filled in to update existing post
  delete "/posts/:id", to: "posts#destroy" # DELETE one specific post
end
