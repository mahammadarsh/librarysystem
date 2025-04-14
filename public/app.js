angular.module('libraryApp', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/signup', {
                template: `
                    <div class="container auth-container">
                        <h3><i class="fas fa-user-plus me-2"></i> Sign Up</h3>
                        <div class="alert alert-danger" ng-show="errorMessage" ng-cloak>{{errorMessage}}</div>
                        <form ng-submit="signup()" name="signupForm" novalidate>
                            <div class="mb-4">
                                <label for="username" class="form-label">Username</label>
                                <input type="text" id="username" class="form-control" ng-model="user.username" placeholder="Enter username" required>
                            </div>
                            <div class="mb-4">
                                <label for="password" class="form-label">Password</label>
                                <input type="password" id="password" class="form-control" ng-model="user.password" placeholder="Enter password" required>
                            </div>
                            <button type="submit" class="btn btn-custom w-100" ng-disabled="signupForm.$invalid">Sign Up</button>
                        </form>
                    </div>
                `,
                controller: 'AuthController'
            })
            .when('/login', {
                template: `
                    <div class="container auth-container">
                        <h3><i class="fas fa-sign-in-alt me-2"></i> Login</h3>
                        <div class="alert alert-danger" ng-show="errorMessage" ng-cloak>{{errorMessage}}</div>
                        <form ng-submit="login()" name="loginForm" novalidate>
                            <div class="mb-4">
                                <label for="username" class="form-label">Username</label>
                                <input type="text" id="username" class="form-control" ng-model="user.username" placeholder="Enter username" required>
                            </div>
                            <div class="mb-4">
                                <label for="password" class="form-label">Password</label>
                                <input type="password" id="password" class="form-control" ng-model="user.password" placeholder="Enter password" required>
                            </div>
                            <button type="submit" class="btn btn-custom w-100" ng-disabled="loginForm.$invalid">Login</button>
                        </form>
                    </div>
                `,
                controller: 'AuthController'
            })
            .when('/library', {
                template: `
                    <div class="container">
                        <h1><i class="fas fa-book me-2"></i> Welcome to Your Library</h1>
                        <div class="alert alert-success" ng-show="successMessage" ng-cloak><i class="fas fa-check-circle me-2"></i> {{successMessage}}</div>
                        <div class="alert alert-danger" ng-show="errorMessage" ng-cloak><i class="fas fa-exclamation-circle me-2"></i> {{errorMessage}}</div>

                        <!-- Dashboard Cards -->
                        <div class="dashboard-cards">
                            <div class="card">
                                <h5>Total Books</h5>
                                <p>{{books.length}}</p>
                            </div>
                            <div class="card">
                                <h5>Available Books</h5>
                                <p>{{availableBooks}}</p>
                            </div>
                            <div class="card">
                                <h5>Checked Out</h5>
                                <p>{{books.length - availableBooks}}</p>
                            </div>
                        </div>

                        <!-- Quick Actions -->
                        <div class="quick-actions">
                            <button class="btn btn-custom" data-bs-toggle="modal" data-bs-target="#addBookModal"><i class="fas fa-plus me-2"></i> Add Book</button>
                            <div class="search-bar">
                                <input type="text" class="form-control" ng-model="searchText" placeholder="Search by title or author..." ng-change="filterBooks()">
                            </div>
                        </div>

                        <!-- Books Table -->
                        <table class="table table-striped" ng-if="filteredBooks.length">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Author</th>
                                    <th>ISBN</th>
                                    <th>Available</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr ng-repeat="book in filteredBooks" style="--i: {{$index}}">
                                    <td>{{book.title}}</td>
                                    <td>{{book.author}}</td>
                                    <td>{{book.isbn}}</td>
                                    <td><span class="badge" ng-class="book.available ? 'bg-success' : 'bg-danger'">{{book.available ? 'Yes' : 'No'}}</span></td>
                                    <td><button class="btn btn-danger btn-sm" ng-click="deleteBook(book._id)"><i class="fas fa-trash"></i> Delete</button></td>
                                </tr>
                            </tbody>
                        </table>
                        <p class="no-books" ng-if="!filteredBooks.length">No books found in the library.</p>

                        <!-- Add Book Modal -->
                        <div class="modal fade" id="addBookModal" tabindex="-1" aria-labelledby="addBookModalLabel" aria-hidden="true">
                            <div class="modal-dialog modal-dialog-centered">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="addBookModalLabel">Add New Book</h5>
                                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        <form ng-submit="addBook()" name="bookForm" novalidate>
                                            <div class="mb-3">
                                                <label for="title" class="form-label">Title</label>
                                                <input type="text" id="title" class="form-control" ng-model="newBook.title" placeholder="Enter book title" required>
                                            </div>
                                            <div class="mb-3">
                                                <label for="author" class="form-label">Author</label>
                                                <input type="text" id="author" class="form-control" ng-model="newBook.author" placeholder="Enter author name" required>
                                            </div>
                                            <div class="mb-3">
                                                <label for="isbn" class="form-label">ISBN</label>
                                                <input type="text" id="isbn" class="form-control" ng-model="newBook.isbn" placeholder="Enter ISBN" required>
                                            </div>
                                            <div class="text-end">
                                                <button type="submit" class="btn btn-custom" ng-disabled="bookForm.$invalid" data-bs-dismiss="modal">Add Book</button>
                                                <button type="button" class="btn btn-secondary" ng-click="resetForm()" data-bs-dismiss="modal">Cancel</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `,
                controller: 'LibraryController'
            })
            .otherwise({ redirectTo: '/login' });
    }])
    .controller('MainController', function($scope, $location) {
        $scope.isLoggedIn = !!localStorage.getItem('token');

        $scope.logout = function() {
            localStorage.removeItem('token');
            $scope.isLoggedIn = false;
            $location.path('/login');
        };

        $scope.$on('$routeChangeSuccess', function() {
            $scope.isLoggedIn = !!localStorage.getItem('token');
        });
    })
    .controller('AuthController', function($scope, $http, $location) {
        $scope.user = {};
        $scope.errorMessage = '';

        $scope.signup = function() {
            $http.post('/api/signup', $scope.user)
                .then(function(response) {
                    $location.path('/login');
                })
                .catch(function(error) {
                    $scope.errorMessage = error.data.error || 'Signup failed';
                });
        };

        $scope.login = function() {
            $http.post('/api/login', $scope.user)
                .then(function(response) {
                    localStorage.setItem('token', response.data.token);
                    $scope.$parent.isLoggedIn = true;
                    $location.path('/library');
                })
                .catch(function(error) {
                    $scope.errorMessage = error.data.error || 'Login failed';
                });
        };
    })
    .controller('LibraryController', function($scope, $http, $timeout, $location) {
        $scope.newBook = { available: true };
        $scope.successMessage = '';
        $scope.errorMessage = '';
        $scope.searchText = '';
        $scope.books = [];
        $scope.filteredBooks = [];
        $scope.availableBooks = 0;

        if (!localStorage.getItem('token')) {
            $location.path('/login');
            return;
        }

        $http.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');

        function getBooks() {
            $http.get('/api/books')
                .then(function(response) {
                    $scope.books = response.data;
                    $scope.availableBooks = $scope.books.filter(book => book.available).length;
                    $scope.filterBooks();
                })
                .catch(function(error) {
                    $scope.errorMessage = 'Error fetching books: ' + (error.data?.error || 'Unknown error');
                    if (error.status === 401 || error.status === 403) $location.path('/login');
                    hideMessages();
                });
        }
        getBooks();

        $scope.addBook = function() {
            $http.post('/api/books', $scope.newBook)
                .then(function(response) {
                    $scope.successMessage = 'Book "' + $scope.newBook.title + '" added successfully!';
                    $scope.newBook = { available: true };
                    $scope.bookForm.$setPristine();
                    getBooks();
                    hideMessages();
                })
                .catch(function(error) {
                    $scope.errorMessage = 'Error adding book: ' + (error.data?.error || 'Unknown error');
                    hideMessages();
                });
        };

        $scope.deleteBook = function(id) {
            if (confirm('Are you sure you want to delete this book?')) {
                $http.delete('/api/books/' + id)
                    .then(function(response) {
                        $scope.successMessage = 'Book deleted successfully!';
                        getBooks();
                        hideMessages();
                    })
                    .catch(function(error) {
                        $scope.errorMessage = 'Error deleting book: ' + (error.data?.error || 'Unknown error');
                        hideMessages();
                    });
            }
        };

        $scope.filterBooks = function() {
            $scope.filteredBooks = $scope.books.filter(function(book) {
                const searchLower = $scope.searchText.toLowerCase();
                return (
                    book.title.toLowerCase().includes(searchLower) ||
                    book.author.toLowerCase().includes(searchLower)
                );
            });
        };

        $scope.resetForm = function() {
            $scope.newBook = { available: true };
            $scope.bookForm.$setPristine();
        };

        function hideMessages() {
            $timeout(function() {
                $scope.successMessage = '';
                $scope.errorMessage = '';
            }, 3000);
        }
    });