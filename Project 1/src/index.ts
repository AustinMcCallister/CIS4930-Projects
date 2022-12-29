const displayController = (() => {
  // DOM Cache
  const _header: Element = document.querySelector('.image-header-container')!;
  const _ratingStarsContainer: Element = document.querySelector('.rating-stars-container')!;

  const init = (): void => {
    drawScore();
    reviewForm.bindStars();
    reviewForm.bindSubmit();
  };

  const drawScore = (): void => {
    const scoreBoard: HTMLDivElement = document.createElement('div');
    scoreBoard.classList.add('product-stars');
    const docFrag: DocumentFragment = document.createDocumentFragment();
    let numStars: number = 0;
    for (let i: number = 0; i < scoreController.getUserScore(); i++) {
      // Handle scores between integers
      if ((Math.round((scoreController.getUserScore() - i) * 10) / 10) < 1) {
        if ((Math.round((scoreController.getUserScore() - i) * 10) / 10) >= 0.5) {
          docFrag.appendChild(addStar('half'));
        }
        else {
          docFrag.appendChild(addStar('empty'));
        }
      }
      else {
        docFrag.appendChild(addStar('full'));
      }
      numStars++;
    }
    // Ensure there are always 5 stars
    if (numStars < 5) {
      for (let i: number = numStars; i < 5; i++) {
        docFrag.appendChild(addStar('empty'));
      }
    }
    const score: HTMLDivElement = document.createElement('div');
    score.classList.add('product-score');
    score.textContent = `${scoreController.getUserScore().toFixed(1)} / 5`;
    docFrag.appendChild(score);
    scoreBoard.appendChild(docFrag);
    _header.appendChild(scoreBoard);
  };

  const addStar = (state: string): SVGSVGElement => {
    const svg: SVGSVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const path: SVGPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    svg.setAttribute('viewBox', '0 0 24 24');
    path.setAttribute('fill', 'currentColor');
    switch (state) {
      case 'full':
        path.setAttribute('d', 'M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z');
        break;
      case 'half':
        path.setAttribute('d', 'M12,15.4V6.1L13.71,10.13L18.09,10.5L14.77,13.39L15.76,17.67M22,9.24L14.81,8.63L12,2L9.19,8.63L2,9.24L7.45,13.97L5.82,21L12,17.27L18.18,21L16.54,13.97L22,9.24Z');
        break;
      case 'empty':
        path.setAttribute('d', 'M12,15.39L8.24,17.66L9.23,13.38L5.91,10.5L10.29,10.13L12,6.09L13.71,10.13L18.09,10.5L14.77,13.38L15.76,17.66M22,9.24L14.81,8.63L12,2L9.19,8.63L2,9.24L7.45,13.97L5.82,21L12,17.27L18.18,21L16.54,13.97L22,9.24Z');
        break;
    }
    svg.appendChild(path);
    return svg;
  };

  const drawRatingStars = (count: number): void => {
    const ratingStars: HTMLDivElement = document.createElement('div');
    ratingStars.classList.add('rating-stars');
    let numStars: number = 0;
    for (let i: number = 1; i <= count; i++) {
      const star: HTMLDivElement = document.createElement('div');
      star.id = `${i}`;
      star.classList.add('star');
      star.appendChild(addStar('full'));
      ratingStars.appendChild(star);
      numStars++;
    }
    if (numStars < 5) {
      for (let i: number = numStars; i < 5; i++) {
        const star: HTMLDivElement = document.createElement('div');
        star.id = `${i + 1}`;
        star.classList.add('star');
        star.appendChild(addStar('empty'));
        ratingStars.appendChild(star);
      }
    }
    _ratingStarsContainer.appendChild(ratingStars);
  }

  const deleteScore = (): void => {
    const _scoreBoard: Element | null = document.querySelector('.product-stars');
    if (_scoreBoard) {
      _scoreBoard.remove();
    }
  };

  const deleteRating = (): void => {
    const _ratingStars: Element | null = document.querySelector('.rating-stars');
    if (_ratingStars) {
      _ratingStars.remove();
    }
  };

  return {
    init,
    drawScore,
    addStar,
    drawRatingStars,
    deleteScore,
    deleteRating,
  };
})();

const scoreController = (() => {
  let _userScore: number = 0;

  const getUserScore = (): number => {
    return _userScore;
  };

  const setUserScore = (score: number): void => {
    _userScore = score;
  };

  return {
    getUserScore,
    setUserScore,
  };
})();

const reviewForm = (() => {
  // DOM Cache
  const _submitButton: Element = document.querySelector('.submit-review')!;

  let _rating: number = 1;

  const bindStars = (): void => {
    const _stars: NodeListOf<Element> = document.querySelectorAll('.star');
    _stars.forEach((star: Element): void => {
      star.addEventListener('click', (event: Event): void => {
        switch ((event.currentTarget as Element).getAttribute('id')) {
          case '1':
            _rating = 1;
            break;
          case '2':
            _rating = 2;
            break;
          case '3':
            _rating = 3;
            break;
          case '4':
            _rating = 4;
            break;
          case '5':
            _rating = 5;
            break;
        }
        displayController.deleteRating();
        displayController.drawRatingStars(_rating);
        bindStars();
      });
    });
  };

  const bindSubmit = (): void => {
    _submitButton.addEventListener('click', (): void => {
      const nameBlock = (document.getElementById('name') as HTMLInputElement)!;
      const commentBlock = (document.getElementById('comment') as HTMLInputElement)!;
      if (nameBlock.value) {
        reviewController.addReview(nameBlock.value, commentBlock.value, _rating);
        scoreController.setUserScore(reviewController.getReviewScore());
        nameBlock.value = '';
        commentBlock.value = '';
        displayController.deleteScore();
        displayController.drawScore();
      }
      else {
        nameBlock.setCustomValidity('This field is required');
        nameBlock.reportValidity();
      }
    });
  };

  const getRating = (): number => {
    return _rating;
  };

  const setRating = (rating: number): void => {
    _rating = rating;
  };

  return {
    bindStars,
    bindSubmit,
    getRating,
    setRating,
  };
})();

const reviewController = (() => {
  //DOM cache
  const _reviewSection: Element = document.querySelector('.customer-reviews')!;

  let _reviewScores: number[] = [];

  const addReview = (name: string, comment: string | null, rating: number): void => {
    const date: Date = new Date();
    document.createDocumentFragment();
    const review: HTMLDivElement = document.createElement('div');
    review.classList.add('review');
    const header: HTMLDivElement = document.createElement('div');
    header.classList.add('review-name');
    header.textContent = name;
    const stars: HTMLDivElement = document.createElement('div');
    stars.classList.add('review-score');
    for (let i: number = 0; i < rating; i++) {
      stars.appendChild(displayController.addStar('full'));
    }
    const reviewDate: HTMLDivElement = document.createElement('div');
    reviewDate.classList.add('review-date');
    reviewDate.textContent = `${date.getDate()} / ${date.getMonth() + 1} / ${date.getFullYear()}`
    const text: HTMLDivElement = document.createElement('div');
    text.classList.add('review-comment');
    text.textContent = comment;
    review.appendChild(header);
    review.appendChild(stars);
    review.appendChild(reviewDate);
    review.appendChild(text);
    _reviewSection.appendChild(review);
    _reviewScores.push(rating);
    reviewForm.setRating(1);
    displayController.deleteRating();
    displayController.drawRatingStars(reviewForm.getRating());
    reviewForm.bindStars();
  };

  const getReviewScore = (): number => {
    let total: number = 0;
    _reviewScores.forEach((score: number): void => {
      total += score;
    });
    return (total / _reviewScores.length);
  };

  return {
    addReview,
    getReviewScore,
  };
})();

displayController.init();
