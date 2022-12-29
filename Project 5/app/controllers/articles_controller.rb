class ArticlesController < ApplicationController
  http_basic_authenticate_with name: "asdf", password: "asdf", except: [:index, :show]

  def index
    @articles = Article.all # fetches all articles from database
  end

  def show
    @article = Article.find(params[:id]) # pulls id param from http request to find specific article by id
  end

  def new
    @article = Article.new # can use article to pre-populate form fields
  end

  def create
    @article = Article.new(article_params) # uses submitted form data in the params hash to create article

    if @article.save
      redirect_to @article # if validation passes, save to database and redirect to article page
    else
      render :new, status: :unprocessable_entity # if validation fails, re-render form and pass http code 422
    end
  end

  def edit
    @article = Article.find(params[:id]) # fetches an article by id and stores in local variable @article
  end

  def update
    @article = Article.find(params[:id])

    if @article.update(article_params)
      redirect_to @article
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @article = Article.find(params[:id])
    @article.destroy

    redirect_to root_path, status: :see_other # redirects to root and returns http code 303
  end

  private
  def article_params # strong parameters
    params.require(:article).permit(:title, :body, :status) # specifies what parameters are allowed in the params hash
  end
end
