using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TbayIndigenousSupportHub.API.Migrations
{
    /// <inheritdoc />
    public partial class AddCoordinatesToServiceAndBusiness : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "Latitude",
                table: "Services",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Longitude",
                table: "Services",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Latitude",
                table: "Businesses",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Longitude",
                table: "Businesses",
                type: "float",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Latitude",
                table: "Services");

            migrationBuilder.DropColumn(
                name: "Longitude",
                table: "Services");

            migrationBuilder.DropColumn(
                name: "Latitude",
                table: "Businesses");

            migrationBuilder.DropColumn(
                name: "Longitude",
                table: "Businesses");
        }
    }
}
